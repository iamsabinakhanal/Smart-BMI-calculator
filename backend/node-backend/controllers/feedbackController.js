const Feedback = require('../models/Feedback');

// POST: Create new feedback
exports.createFeedback = async (req, res) => {
  const { rating, feedbackText } = req.body;

  if (!rating) {
    return res.status(400).json({ error: 'Rating is required' });
  }

  try {
    const feedback = new Feedback({ rating, feedbackText });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
