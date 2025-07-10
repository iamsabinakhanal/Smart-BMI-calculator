// models/Plan.js
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nutritionPlan: { type: Object, required: true },
  fitnessPlan: { type: Object, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
