const express = require('express');
const axios = require('axios');
const SymptomHistory = require('../models/SymptomHistory');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to handle symptoms diagnosis
router.post('/diagnosis', authMiddleware, async (req, res) => {
  const { symptoms } = req.body;
  const userId = req.user?.id;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: 'Symptoms are required.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: "You are a virtual medical assistant. Provide a diagnosis or advice based on the user's symptoms. Include a disclaimer about consulting a healthcare professional." },
          { role: 'user', content: `The symptoms are: ${symptoms.join(', ')}.` },
        ],
        max_tokens: 300,
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    const diagnosis = response.data.choices[0]?.message?.content;
    await SymptomHistory.create({ userId, symptoms, diagnosis });
    res.json({ diagnosis });
  } catch (err) {
    res.status(500).json({ error: 'Unable to process symptoms. Please try again.' });
  }
});

// Route to get symptom history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await SymptomHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch history.' });
  }
});



// Route to handle AI-generated health tips
router.post('/tips', async (req, res) => {
  const { diagnosis } = req.body;

  if (!diagnosis) {
    return res.status(400).json({ error: 'Diagnosis is required.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: "You are a virtual health assistant. Provide concise health tips or remedies based on the user's diagnosis. Include a disclaimer."
          },
          {
            role: 'user',
            content: `The diagnosis is: ${diagnosis}. Provide health tips or remedies.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const tips = response.data.choices[0]?.message?.content;
    if (!tips) {
      throw new Error('No tips returned from OpenAI.');
    }

    res.json({ tips });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Unable to fetch tips. Please try again later.' });
  }
});


module.exports = router;
