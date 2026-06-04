import React from "react";
import {
  FaPaperPlane,
  FaDownload,
  FaFileInvoiceDollar,
  FaMobileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/quick-actions.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      name: "Send Money",
      icon: <FaPaperPlane />,
      color: "#312226",
      route: "/transfer",
    },
    {
      name: "Receive Money",
      icon: <FaDownload />,
      color: "#10b981",
      route: "/deposit",
    },
    {
      name: "Pay Bills",
      icon: <FaFileInvoiceDollar />,
      color: "#f59e0b",
      route: "/paybills",
    },
    {
      name: "Top Up",
      icon: <FaMobileAlt />,
      color: "#8b5cf6",
      route: "/topup",
    },
    {
      name: "Withdraw",
      icon: <FaMobileAlt />,
      color: "#ec4899",
      route: "/withdraw",
    },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          className="quick-btn"
          style={{ "--accent": action.color }}
          onClick={() => navigate(action.route)}
        >
          <div className="btn-icon">{action.icon}</div>
          <span>{action.name}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;