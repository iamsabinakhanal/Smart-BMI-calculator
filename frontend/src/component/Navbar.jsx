import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
        Smart<span>BMI</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/bmi-calculator" className="nav-link">Calculate BMI</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;