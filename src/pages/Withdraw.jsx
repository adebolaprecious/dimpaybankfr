import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Sidebar from '../components/Sidebar';
import Heading from '../components/Heading';
import { FaArrowDown, FaWallet, FaCheckCircle, FaTimes, FaBars, FaSpinner } from 'react-icons/fa';
import './WithdrawPage.css';

const cookies = new Cookies();

const WithdrawPage = () => {
  const [formData, setFormData] = useState({ amount: '', method: 'Bank Transfer', note: '' });
  const [pin, setPin] = useState("");
  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchWallet(storedUser);
  }, []);

  const fetchWallet = async (storedUser) => {
    try {
      const u = storedUser || JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${u.id}`);
      setWallet(res.data.wallet);
    } catch (err) { console.log(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWithdraw = async () => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMsg("Enter a valid amount");
      return;
    }
    if (pin.length !== 4) {
      setErrorMsg("Enter your 4-digit PIN");
      return;
    }
    if (Number(formData.amount) > wallet?.balance) {
      setErrorMsg("Insufficient funds");
      return;
    }

    setLoading(true);
    try {
      const token = cookies.get("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/withdraw`,
        { userId: user.id, amount: Number(formData.amount), pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactionId(res.data.reference);
      setShowSuccess(true);
      await fetchWallet(user);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Withdrawal failed");
    } finally { setLoading(false); }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setFormData({ amount: '', method: 'Bank Transfer', note: '' });
    setPin('');
    setTransactionId('');
  };

  return (
    <div className="withdraw-page">
      <div className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
        <Sidebar />
      </div>

      <div className="withdraw-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <Heading title="DimPay Bank" />

        <div className="withdraw-container">
          {/* Top Balance Banner */}
          <div className="balance-banner">
            <div className="balance-left">
              <div className="balance-icon"><FaWallet /></div>
              <div>
                <p className="balance-label">Available Balance</p>
                <h2 className="balance-amount">
                  ₦{wallet?.balance?.toLocaleString() || '0'}
                </h2>
              </div>
            </div>
            <div className="user-chip">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="user-name">{user?.firstName} {user?.lastName}</p>
                <small className="user-role">Premium User</small>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="withdraw-card">
            <div className="card-title-row">
              <FaArrowDown className="card-title-icon" />
              <h3>Withdraw Funds</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount (₦)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Withdrawal Method</label>
                <select name="method" value={formData.method} onChange={handleChange}>
                  <option>Bank Transfer</option>
                  <option>ACH Transfer</option>
                  <option>Wire Transfer</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Transaction PIN</label>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="form-group">
                <label>Note <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  name="note"
                  placeholder="Purpose of withdrawal"
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="withdraw-btn" onClick={handleWithdraw} disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : <FaArrowDown />}
              {loading ? "Processing..." : "Confirm Withdrawal"}
            </button>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-modal">
          <div className="receipt-card">
            <button className="close-btn" onClick={closeSuccess}><FaTimes /></button>
            <div className="receipt-header">
              <div className="success-ring"><FaCheckCircle className="success-icon" /></div>
              <h2>Withdrawal Successful</h2>
              <p className="receipt-subtitle">Your funds have been processed</p>
            </div>
            <div className="receipt-body">
              {[
                ['Amount', `₦${parseFloat(formData.amount).toLocaleString()}`],
                ['Method', formData.method],
                ['Date & Time', new Date().toLocaleString()],
                ['Transaction ID', transactionId],
                ...(formData.note ? [['Note', formData.note]] : [])
              ].map(([label, value]) => (
                <div className="receipt-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button className="done-btn" onClick={closeSuccess}>Done</button>
          </div>
        </div>
      )}
      {/* Error Modal */}
{errorMsg && (
  <div className="success-modal">
    <div className="receipt-card" style={{ textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)',
        border: '2px solid rgba(239,68,68,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', fontSize: 28, color: '#ef4444'
      }}>
        <FaTimes />
      </div>
      <h3 style={{ color: '#fff', marginBottom: 8 }}>Oops!</h3>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{errorMsg}</p>
      <button className="done-btn" onClick={() => setErrorMsg("")}>Try Again</button>
    </div>
  </div>
)}
    </div>
  );
};

export default WithdrawPage;