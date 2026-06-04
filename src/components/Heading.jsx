import React from "react";
import { useNavigate } from "react-router-dom";
import "./Heading.css";

const Heading = ({ title }) => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  const firstName = user?.firstName || "User";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title-bar" />
        <h3>{title}</h3>
      </div>

      <div
        className="user-profile"
        onClick={() => navigate("/profile")}
      >
        <div className="avatar-circle">{initial}</div>
        <div className="user-info">
          <span className="user-name">{firstName}</span>
          <span className="user-role">Premium User</span>
        </div>
      </div>
    </header>
  );
};

export default Heading;