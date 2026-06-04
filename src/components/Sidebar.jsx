import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";
import {
  FaHome, FaUserCircle, FaExchangeAlt, FaCreditCard,
  FaMoneyBillWave, FaHandHoldingUsd, FaCog, FaUserShield, FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const handleLogout = () => {
    cookies.remove('token');
    localStorage.clear();
    navigate('/login');
  };
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>Dimpay</span>
      </div>

      <nav>
        <NavLink to="/dashboard" className="nav-link"><FaHome /> <span>Dashboard</span></NavLink>
        {/* <NavLink to="/accounts" className="nav-link"><FaUserCircle /> <span>Accounts</span></NavLink> */}
        <NavLink to="/transactions" className="nav-link"><FaExchangeAlt /> <span>Transactions</span></NavLink>
        <NavLink to="/transfer" className="nav-link"><FaMoneyBillWave /> <span>Transfer</span></NavLink>
        <NavLink to="/cards" className="nav-link"><FaCreditCard /> <span>Cards</span></NavLink>
        <NavLink to="/withdraw" className="nav-link"><FaHandHoldingUsd /> <span>Withdraw</span></NavLink>
          <NavLink to="/deposit" className="nav-link"><FaHandHoldingUsd /> <span>Deposit</span></NavLink>
        {/* <NavLink to="/loans" className="nav-link"><FaHandHoldingUsd /> <span>Loans</span></NavLink> */}
        <NavLink to="/settings" className="nav-link"><FaCog /> <span>Settings</span></NavLink>
        <NavLink className="nav-link" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className="nav-link admin-link">
            <FaUserShield /> <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;