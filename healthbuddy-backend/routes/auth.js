const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Practitioner = require('../models/Practitioner'); // Ensure this model exists
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'heavenly';

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Practitioner Registration
router.post('/practitioner-register', async (req, res) => {
  const { name, email, password, field, consultationFee } = req.body;

  if (!name || !email || !password || !field || !consultationFee) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingPractitioner = await Practitioner.findOne({ email });
    if (existingPractitioner) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const practitioner = new Practitioner({
      name,
      email,
      password,
      field,
      consultationFee,
    });

    await practitioner.save();
    res.status(201).json({ message: 'Practitioner registered successfully.' });
  } catch (error) {
    console.error('Error registering practitioner:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body; // Add role to determine user or practitioner
  if (!email || !password || !role) {
    console.log(req.body);
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }

  try {
    let user;
    if (role === 'user') {
      user = await User.findOne({ email });
    } else if (role === 'practitioner') {
      user = await Practitioner.findOne({ email });
    } else {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    if (!user) {
      console.log(req.body);
      return res.status(400).json({ error: 'User was not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(req.body);
      console.log(password);
      console.log(user.password);
      console.log(isPasswordValid);
      return res.status(400).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
