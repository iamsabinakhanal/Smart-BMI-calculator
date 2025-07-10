const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  feedbackText: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
