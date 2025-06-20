import React from 'react';
import '../styles/SmartBMI.css';
import lady from "../assets/images/lady.png"

import  exercise from"../assets/images/exercise.png"
import Navbar from './Navbar';
const SmartBMI = () => {
  return (
    <>
    <Navbar/>
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
        </div>

        {/* Equipment Section */}
        <section className="equipment-section">
          <h2>We Suggest Exercise </h2>
          <h5>No Need Gym/Zumba</h5>
          <img src={exercise} alt="Gym equipment collage" />
        </section>
    </>
  );
};

export default SmartBMI;