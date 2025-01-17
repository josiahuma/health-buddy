const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const symptomsRoutes = require('./routes/symptoms');
const practitionerRoutes = require('./routes/practitioners');
const userRoutes = require('./routes/users');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); // Consolidate authentication routes under one endpoint
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/practitioners', practitionerRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});


const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Connection error:', error);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Log OpenAI API Key (only for debugging, remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);
}
