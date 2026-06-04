import React, { useState } from "react";
import "./Navbar.css";
import { Link, Links, useNavigate } from "react-router-dom";

const Navbar = () => {
const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();
return (
<nav className="navbar">
{/* Logo */}
<div className="navbar-logo">
<h2>🏦 DimPay</h2>
</div>

{/* Hamburger */}
<div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
☰
</div>

{/* Nav Links */}
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
  <Link to= "/product">Products</Link>
<ul className="dropdown-menu">
<li><a href="/">Accounts</a></li>
<li><a href="/">Cards</a></li>
<li><a href="/">Loans</a></li>
<li><a href="/">Investments</a></li>
</ul>
</li>

<li className="dropdown">
<Link to="/our-features">Features</ Link>
<ul className="dropdown-menu">
<li><a href="/">Mobile App</a></li>
<li><a href="/">Easy Payments</a></li>
<li><a href="/">24/7 Support</a></li>
</ul>
</li>

<li><a href="/">Security</a></li>
<li><a href="/">Contact</a></li>

{/* Buttons inside mobile menu */}
<div className="mobile-buttons">
<button className="login-btn" onClick={()=>(navigate('/login'))}>Login</button>
<button className="Sign-up" onClick={()=>(navigate('/register'))}>Sign Up</button>
</div>
</ul>

{/* Desktop Buttons */}
<div className="navbar-buttons">
<button className="login-btn" onClick={()=>(navigate('/login'))}>Login</button>
<button className="Sign-up" onClick={()=>(navigate('/register'))}>Sign Up</button>
</div>
</nav>
);
};

export default Navbar;

