// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  ethnicity: { type: Number, required: true },
  lifestyle: { type: Number, required: true },
  income: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
