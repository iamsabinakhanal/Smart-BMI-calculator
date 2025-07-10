const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to submit feedback
router.post('/feedback', feedbackController.createFeedback);

module.exports = router;
