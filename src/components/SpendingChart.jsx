import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { FaExchangeAlt, FaMobileAlt, FaDatabase, FaTv, FaArrowUp, FaMoneyBillWave } from "react-icons/fa";

const cookies = new Cookies();

const CATEGORY_CONFIG = {
  transfer:    { label: "Transfer",    color: "#7c3aed", icon: <FaExchangeAlt /> },
  withdrawal:  { label: "Withdrawal",  color: "#ef4444", icon: <FaArrowUp /> },
  airtime:     { label: "Airtime",     color: "#f59e0b", icon: <FaMobileAlt /> },
  data:        { label: "Data",        color: "#3b82f6", icon: <FaDatabase /> },
  gotv:        { label: "GoTV",        color: "#10b981", icon: <FaTv /> },
  dstv:        { label: "DSTV",        color: "#06b6d4", icon: <FaTv /> },
  startimes:   { label: "Startimes",   color: "#8b5cf6", icon: <FaTv /> },
  deposit:     { label: "Deposit",     color: "#22c55e", icon: <FaMoneyBillWave /> },
};

const debitTypes = ["transfer", "withdrawal", "airtime", "data", "gotv", "dstv", "startimes"];

const SpendingChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = cookies.get("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Group spending by category
  const debitTx = transactions.filter(t => debitTypes.includes(t.type?.toLowerCase()));
  const totalSpent = debitTx.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = debitTx.reduce((acc, t) => {
    const key = t.type?.toLowerCase();
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {});

  const categories = Object.entries(categoryTotals)
    .map(([key, amount]) => ({
      key,
      amount,
      label: CATEGORY_CONFIG[key]?.label || key,
      color: CATEGORY_CONFIG[key]?.color || "#6b7280",
      icon: CATEGORY_CONFIG[key]?.icon,
      percent: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Build SVG donut segments
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = categories.map((cat) => {
    const dash = (cat.percent / 100) * circumference;
    const gap = circumference - dash;
    const seg = { ...cat, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="chart-card">
      <h3>Spending Overview</h3>

      {loading ? (
        <div className="chart-loading">
          <div className="chart-spinner" />
        </div>
      ) : totalSpent === 0 ? (
        <div className="chart-empty">
          <p>No spending data yet</p>
        </div>
      ) : (
        <div className="chart-body">
          {/* Donut */}
          <div className="donut-wrap">
            <svg viewBox="0 0 180 180" width="180" height="180">
              <circle
                cx="90" cy="90" r={radius}
                fill="none"
                stroke="#1e1e2e"
                strokeWidth="22"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.key}
                  cx="90" cy="90" r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="22"
                  strokeDasharray={`${seg.dash} ${seg.gap}`}
                  strokeDashoffset={-seg.offset}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              ))}
            </svg>
            <div className="donut-center">
              <span className="donut-label">Total Spent</span>
              <span className="donut-amount">₦{totalSpent.toLocaleString()}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            {categories.map((cat) => (
              <div className="legend-row" key={cat.key}>
                <div className="legend-left">
                  <div className="legend-dot" style={{ background: cat.color }} />
                  <span className="legend-label">{cat.label}</span>
                </div>
                <div className="legend-right">
                  <span className="legend-percent">{cat.percent.toFixed(0)}%</span>
                  <span className="legend-amount">₦{cat.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;