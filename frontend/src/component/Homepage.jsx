import React from 'react';
import '../styles/Homepage.css';
import lady from "../assets/images/lady.png";
// import team from "../assets/images/team.png"; // Add this image
// import benefits from "../assets/images/benefits.png"; // Add this image
import Navbar from './Navbar';
import Footer from './Footer';

const Homepage = () => {
  return (
    <>
      <Navbar/>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Empower Your Fitness Journey with Personalized Insights</h1>
            <p className="subtext">
              Discover your BMI, set your body goals, and receive tailored exercise recommendations
            </p>
            <a href="/bmi" className="bmi-btn">
              Calculate your BMI Now ›
            </a>
          </div>
          <div className="hero-image">
            <img src={lady} alt="Lady with BMI screen" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="section-header">
          <h2>About BMI Tracker</h2>
          <p className="section-subtitle">Your personal health companion</p>
        </div>
        <div className="about-content">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              We believe everyone deserves access to simple, accurate health tools. 
              Our BMI calculator helps you understand your body composition and 
              provides personalized recommendations to improve your health.
            </p>
          </div>
          <div className="about-card">
            <h3>Why BMI Matters</h3>
            <p>
              Body Mass Index is a useful screening tool that can indicate whether 
              you're at a healthy weight. While it's not perfect, it's a great 
              starting point for your health journey.
            </p>
          </div>
          <div className="about-card">
            <h3>Our Approach</h3>
            <p>
              We provide clear, actionable information without judgment. Our goal 
              is to empower you with knowledge and tools to make informed decisions 
              about your health and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Key Features</h2>
          <p className="section-subtitle">What makes our tool special</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Accurate Calculations</h3>
            <p>Precise BMI computation using medical-grade formulas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Goals</h3>
            <p>Personalized nutrition and fitness recommendations based on your results</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Nutrition Database</h3>
            <p>Food recommendations tailored to your BMI goals</p>
          </div>
        </div>
      </section>



      <Footer/>
    </>
  );
};

export default Homepage;