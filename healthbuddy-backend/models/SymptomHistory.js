const mongoose = require('mongoose');

const symptomHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: { type: [String], required: true },
  diagnosis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SymptomHistory', symptomHistorySchema);
