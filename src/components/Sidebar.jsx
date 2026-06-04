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

  return (
    <aside className="sidebar">
      <div className="logo">
        <span></span>
      </div>

      <nav>
        <NavLink to="/dashboard" className="nav-link" onClick={onClose}>
          <FaHome /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className="nav-link" onClick={onClose}>
          <FaExchangeAlt /> <span>Transactions</span>
        </NavLink>
        <NavLink to="/transfer" className="nav-link" onClick={onClose}>
          <FaMoneyBillWave /> <span>Transfer</span>
        </NavLink>
        <NavLink to="/cards" className="nav-link" onClick={onClose}>
          <FaCreditCard /> <span>Cards</span>
        </NavLink>
        <NavLink to="/withdraw" className="nav-link" onClick={onClose}>
          <FaHandHoldingUsd /> <span>Withdraw</span>
        </NavLink>
        <NavLink to="/deposit" className="nav-link" onClick={onClose}>
          <FaHandHoldingUsd /> <span>Deposit</span>
        </NavLink>
        <NavLink to="/settings" className="nav-link" onClick={onClose}>
          <FaCog /> <span>Settings</span>
        </NavLink>

        {/* ✅ Only renders for admin users */}
        {isAdmin && (
          <NavLink to="/admin" className="nav-link admin-link" onClick={onClose}>
            <FaUserShield /> <span>Admin</span>
          </NavLink>
        )}

        <button className="nav-link" onClick={() => { handleLogout(); onClose?.(); }}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;