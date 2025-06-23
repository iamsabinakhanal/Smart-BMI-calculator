import React from 'react';
import '../styles/SmartBMI.css';
import lady from "../assets/images/lady.png";
import exercise from "../assets/images/exercise.png";
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD:src/component/SmartBMI.jsx
=======
import  exercise from"../assets/images/exercise.png"
import Navbar from './Navbar';
>>>>>>> origin/Dipika:frontend/src/component/SmartBMI.jsx
const SmartBMI = () => {
  const navigate = useNavigate();

  return (
    <>
<<<<<<< HEAD:src/component/SmartBMI.jsx
      {/* HEADER */}
      <header>
        {/* NAVBAR */}
        <div className="navbar">
          <div className="logo">SmartBMI</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <button href="#">LOGIN</button>
            <button href="#">SIGNUP</button>
          </nav>
        </div>

=======
    <Navbar/>
>>>>>>> origin/Dipika:frontend/src/component/SmartBMI.jsx
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-text">
            <h1>Empower Your Fitness Journey with Personalized Insights</h1>
            <p className="subtext">
              Discover your BMI, set your body goals,<br /> and receive tailored exercise recommendation
            </p>
            <button className="bmi-btn">› Calculate your BMI Now</button>
          </div>
          <div className="hero-image">
            <img src={lady} alt="Lady with BMI screen" />
          </div>
        </section>

        {/* Side Buttons */}
        <div className="side-buttons">
          <button className="health-insights-btn">Health insights</button>
          <button className="nutrition-plan-btn">Nutritional plan</button>
          {/* Updated button to navigate to /fitness */}
          <button
            className="fitness-btn"
            onClick={() => navigate('/fitness')}
          >
            Fitness
          </button>
        </div>

        {/* Equipment Section */}
        <section className="equipment-section">
          <h2>We Suggest Exercise</h2>
          <h3>No Need Gym/Zumba/Coach</h3>
          <h5>All your exercise plan at your home through AI coach</h5>
          <img src={exercise} alt="Gym equipment collage" />
        </section>
    </>
  );
};

export default SmartBMI;