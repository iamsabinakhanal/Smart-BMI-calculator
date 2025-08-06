// routes/feedback.js

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Import the Feedback model

// --- Public Route: Submit New Feedback ---
// POST /api/feedback
// Allows users to submit new feedback.
router.post('/', async (req, res) => {
  try {
    const { userId, name, message, rating } = req.body; // Destructure 'name'

    // Basic validation
    if (!message) {
      return res.status(400).json({ message: 'Feedback message is required.' });
    }
    if (message.length < 10) {
      return res.status(400).json({ message: 'Feedback message must be at least 10 characters long.' });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Create a new feedback instance
    const newFeedback = new Feedback({
      userId: userId || null,
      name: name || null, // Assign the name
      message,
      rating
    });

    // Save the feedback to the database
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
});

// --- Admin Route: Get All Feedback ---
// GET /api/feedback/all
// Fetches all feedback entries. This should ideally be protected for admin access.
router.get('/all', async (req, res) => {
  try {
    // Populate the 'userId' field to get user details if linked
    // Also include 'name' in the projection for userId if you want it from the User model
    const feedback = await Feedback.find().populate('userId', 'name age bmi');
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
});

// --- Admin Route: Delete Feedback ---
// DELETE /api/feedback/:id
// Allows an admin to delete a specific feedback entry.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully!' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error while deleting feedback.' });
  }
});


module.exports = router;
