// models/Feedback.js

const mongoose = require('mongoose');

// Define the schema for the Feedback model
const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: { // Make this field required
    type: String,
    trim: true,
    required: true // <--- CHANGED FROM false TO true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Feedback model
module.exports = mongoose.model('Feedback', feedbackSchema);
