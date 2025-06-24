import React from "react";
import '../styles/Navbar.css';

const Navbar = () =>{ 
    return(
      <header>
        {/* NAVBAR */}
        <div className="navbar">
          <div className="logo">SmartBMI</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <button href="#">LOGIN </button>
            <button href="#">SIGNUP </button>
          </nav>
        </div>
        </header>
    )
}
export default Navbar;