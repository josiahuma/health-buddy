const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Fetch user profile
router.get('/user-profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'heavenly');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Update user profile
router.put('/user-profile', async (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id || (!name && !email && !password)) {
    return res.status(400).json({ error: 'User ID and at least one field to update are required.' });
  }

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Unable to update profile. Please try again later.' });
  }
});

module.exports = router;
