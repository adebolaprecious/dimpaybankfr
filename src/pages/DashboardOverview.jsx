import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cookies from "universal-cookie";
import RecentTransactions from "../components/RecentTransactions";
import SpendingChart from "../components/SpendingChart";
import QuickActions from "../components/QuickActions";
import Heading from "../components/Heading";
import {
  FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank,
  FaExchangeAlt, FaMobileAlt, FaTv, FaMoneyBillWave
} from "react-icons/fa";
import "../css/dashboard.css";

const cookies = new Cookies();

const DashboardOverview = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${user.id}`);
        setWallet(res.data.wallet);
        if (res.data.success) localStorage.setItem("walletBalance", res.data.wallet.balance);
      } catch (err) { console.log(err); }
    };

    const fetchTransactions = async () => {
      try {
        const token = cookies.get("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(res.data.transactions || []);
      } catch (err) { console.log(err); }
    };

    fetchWallet();
    fetchTransactions();
    window.addEventListener("walletUpdated", fetchWallet);
    return () => window.removeEventListener("walletUpdated", fetchWallet);
  }, []);

  const debitTypes = ["transfer", "withdrawal", "airtime", "data", "gotv", "dstv", "startimes"];

  const totalIn = transactions.filter(t => !debitTypes.includes(t.type?.toLowerCase()))
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => debitTypes.includes(t.type?.toLowerCase()))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="dashboard">
      {/* Overlay for mobile */}
      {!collapsed && <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />}

      <div className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>

        <Heading title="DimPay Bank" />

        <div className="dashboard-content">
          <Outlet />

          {/* Welcome */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Good day, {user?.firstName} 👋</h2>
              <p>Here's your financial overview</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card balance-card">
              <div className="stat-icon"><FaWallet /></div>
              <div className="stat-info">
                <p>Total Balance</p>
                <h3>₦{wallet?.balance?.toLocaleString() || '0'}</h3>
              </div>
              <div className="stat-glow" />
            </div>

            <div className="stat-card">
              <div className="stat-icon income"><FaArrowDown /></div>
              <div className="stat-info">
                <p>Total Income</p>
                <h3 className="income-text">₦{totalIn.toLocaleString()}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon expense"><FaArrowUp /></div>
              <div className="stat-info">
                <p>Total Expenses</p>
                <h3 className="expense-text">₦{totalOut.toLocaleString()}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon savings"><FaPiggyBank /></div>
              <div className="stat-info">
                <p>Net Savings</p>
                <h3 className={totalIn - totalOut >= 0 ? "income-text" : "expense-text"}>
                  ₦{Math.abs(totalIn - totalOut).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="overview-grid">
            <RecentTransactions />
            <SpendingChart />
          </div>

          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;