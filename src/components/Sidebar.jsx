import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import Cookies from "universal-cookie";
import {
  FaHome, FaExchangeAlt, FaCreditCard,
  FaMoneyBillWave, FaHandHoldingUsd, FaCog, FaUserShield, FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const cookies = new Cookies();

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove('token');
    localStorage.clear();
    navigate('/login');
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <span>Dimpay</span>
      </div>

      <nav>
        <NavLink to="/dashboard" className="nav-link" onClick={handleClose}>
          <FaHome /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className="nav-link" onClick={handleClose}>
          <FaExchangeAlt /> <span>Transactions</span>
        </NavLink>
        <NavLink to="/transfer" className="nav-link" onClick={handleClose}>
          <FaMoneyBillWave /> <span>Transfer</span>
        </NavLink>
        <NavLink to="/cards" className="nav-link" onClick={handleClose}>
          <FaCreditCard /> <span>Cards</span>
        </NavLink>
        <NavLink to="/withdraw" className="nav-link" onClick={handleClose}>
          <FaHandHoldingUsd /> <span>Withdraw</span>
        </NavLink>
        <NavLink to="/deposit" className="nav-link" onClick={handleClose}>
          <FaHandHoldingUsd /> <span>Deposit</span>
        </NavLink>
        <NavLink to="/settings" className="nav-link" onClick={handleClose}>
          <FaCog /> <span>Settings</span>
        </NavLink>
        <NavLink className="nav-link" onClick={() => { handleLogout(); handleClose(); }}>
          <FaSignOutAlt /> <span>Logout</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className="nav-link admin-link" onClick={handleClose}>
            <FaUserShield /> <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;