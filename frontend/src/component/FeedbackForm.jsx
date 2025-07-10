
import React, { useState } from 'react';
import '../styles/FeedbackForm.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleStarMouseOver = (index) => {
    setHoverRating(index);
  };

  const handleStarMouseOut = () => {
    setHoverRating(0);
  };

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSend = () => {
    alert(`Thank you for rating ${rating} stars!\nYour feedback: ${feedback}`);
    // Implement further submission logic here
  };

  return (
    <div className="container">
      <h2>Rate your experience</h2>
      <p>We highly value your feedback! Kindly take a moment to rate your experience and provide us with your valuable feedback.</p>
      
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${ (hoverRating || rating) >= star ? 'selected' : '' }`}
            onMouseOver={() => handleStarMouseOver(star)}
            onMouseOut={handleStarMouseOut}
            onClick={() => handleStarClick(star)}
          >
            &#9733;
          </span>
        ))}
      </div>

      <textarea
        placeholder="Tell us about your experience!"
        rows="5"
        value={feedback}
        onChange={handleFeedbackChange}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default FeedbackForm;