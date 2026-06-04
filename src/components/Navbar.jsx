import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-logo">
        <h2>🏦 DimPay</h2>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </div>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><a href="/">Home</a></li>

        <li className="dropdown">
          <Link to="/about-Us">About Us</Link>
          <ul className="dropdown-menu">
            <li><a href="/">Our Story</a></li>
            <li><a href="/">Mission & Vision</a></li>
            <li><a href="/">Leadership</a></li>
            <li><a href="/">Careers</a></li>
          </ul>
        </li>

        <li className="dropdown">
          <Link to="/product">Products</Link>
          <ul className="dropdown-menu">
            <li><a href="/">Accounts</a></li>
            <li><a href="/">Cards</a></li>
            <li><a href="/">Loans</a></li>
            <li><a href="/">Investments</a></li>
          </ul>
        </li>

        <li className="dropdown">
          <Link to="/our-features">Features</Link>
          <ul className="dropdown-menu">
            <li><a href="/">Mobile App</a></li>
            <li><a href="/">Easy Payments</a></li>
            <li><a href="/">24/7 Support</a></li>
          </ul>
        </li>

        <li><a href="/">Security</a></li>
        <li><a href="/">Contact</a></li>

        <div className="mobile-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </ul>

      <div className="navbar-buttons">
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;