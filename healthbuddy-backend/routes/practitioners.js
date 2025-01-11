const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const router = express.Router();
const Practitioner = require('../models/Practitioner');
const jwt = require('jsonwebtoken');

// Get all practitioners
router.get('/list', async (req, res) => {
  try {
    const practitioners = await Practitioner.find();
    res.json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch practitioners' });
  }
});

// Fetch user profile
router.get('/practitioner-profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'heavenly');
    const practitioner = await Practitioner.findById(decoded.id).select('-password');
    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found.' });
    }
    res.json(practitioner);
  } catch (error) {
    console.error('Error fetching practitioner profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Update practitioner profile
router.put('/practitioner-profile', async (req, res) => {
  const { id, name, email, password, field, consultationFee } = req.body;

  if (!id || (!name && !email && !password && !field && !consultationFee)) {
    console.log(req.body);
    return res.status(400).json({ error: 'User ID and at least one field to update are required.' });
  }

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (field) updateData.field = field;
    if (consultationFee) updateData.consultationFee = consultationFee;

    const updatedPractitioner = await Practitioner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedPractitioner) {
      return res.status(404).json({ error: 'Practitioner not found.' });
    }

    res.json({ message: 'Profile updated successfully.', user: updatedPractitioner });
  } catch (error) {
    console.error('Error updating practitioner profile:', error);
    res.status(500).json({ error: 'Unable to update profile. Please try again later.' });
  }
});

module.exports = router;
