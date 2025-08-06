// components/FeedbackFormPage.js (or pages/FeedbackFormPage.js)

import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaCommentDots } from "react-icons/fa";
import "../styles/FeedbackFormPage.css";
import Navbar from "./Navbar"; // Keep this if you intend to render Navbar here, but generally it's in App.jsx

export default function FeedbackFormPage() {
  // State for Feedback Form
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackStatus('loading');
    setError(null);

    try {
      const userId = null; // Still null as per your setup

      const response = await axios.post("http://localhost:8000/api/feedback", {
        userId: userId,
        name: feedbackName, // Send the name
        message: feedbackMessage,
        rating: feedbackRating
      });
      setFeedbackStatus('success');
      setFeedbackName('');
      setFeedbackMessage('');
      setFeedbackRating(0);
      console.log('Feedback submitted:', response.data);
    } catch (err) {
      setFeedbackStatus('error');
      console.error('Error submitting feedback:', err);
      let errorMessage = "Failed to submit feedback. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setTimeout(() => setFeedbackStatus(null), 3000);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label key={i} className="star-label">
          <input
            type="radio"
            name="rating"
            value={i}
            checked={feedbackRating === i}
            onChange={() => setFeedbackRating(i)}
            className="star-radio"
          />
          {feedbackRating >= i ? <FaStar className="star-icon filled" /> : <FaRegStar className="star-icon" />}
        </label>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  return (
    <>
    {/* Remove <Navbar/> from here if it's already in App.jsx */}
    <Navbar/>
    <div className="feedback-page-container">
      <div className="feedback-form-card">
        <h2><FaCommentDots /> Share Your Feedback</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmitFeedback}>
          <div className="form-group">
            <label htmlFor="feedbackName">Your Name:</label>
            <input
              type="text"
              id="feedbackName"
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              placeholder="Enter your name"
              required // <--- ADDED required attribute
            />
          </div>
          <div className="form-group">
            <label htmlFor="feedbackMessage">Your Message:</label>
            <textarea
              id="feedbackMessage"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Tell us what you think about our BMI calculator and plans..."
              rows="6"
              required
              minLength="10"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Rating:</label>
            {renderStarRating()}
          </div>
          <button type="submit" className="submit-feedback-btn" disabled={feedbackStatus === 'loading'}>
            {feedbackStatus === 'loading' ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {feedbackStatus === 'success' && <p className="success-message">Thank you for your feedback!</p>}
        </form>
      </div>
    </div>
    </>
  );
}
