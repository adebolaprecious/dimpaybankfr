import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Sidebar from '../components/Sidebar';
import Heading from '../components/Heading';
import {
  FaBars, FaTimes, FaArrowDown, FaWallet,
  FaCheckCircle, FaSpinner, FaUniversity
} from 'react-icons/fa';
import './DepositStyle.css';

const cookies = new Cookies();

const DepositPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [note, setNote] = useState('');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successRef, setSuccessRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = cookies.get('token');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${user.id}`);
        setWallet(res.data.wallet);
      } catch (e) { console.log(e); }
    };
    fetchWallet();
  }, []);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return setErrorMsg('Please enter a valid amount');
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/depositfunds`,
        { userId: user.id, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        localStorage.setItem('walletBalance', res.data.wallet.balance);
        window.dispatchEvent(new Event('walletUpdated'));
        setSuccessRef('DEP-' + Date.now());
        setShowSuccess(true);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setAmount('');
    setNote('');
    navigate('/dashboard');
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 50000];

  return (
    <div className="deposit-page">
      <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className="deposit-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>

        <Heading title="DimPay Bank" />

        <div className="deposit-container">
          {/* Balance Banner */}
          <div className="deposit-balance-banner">
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
          <div className="deposit-card">
            <div className="deposit-card-title">
              <FaArrowDown className="deposit-title-icon" />
              <h3>Deposit Funds</h3>
            </div>

            {/* Quick Amounts */}
            <div className="form-group">
              <label>Quick Select Amount</label>
              <div className="quick-amounts">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    className={`quick-amt-btn ${Number(amount) === amt ? 'selected' : ''}`}
                    onClick={() => setAmount(String(amt))}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount (₦)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Deposit Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option>Bank Transfer</option>
                  <option>ACH Transfer</option>
                  <option>Wire Transfer</option>
                  <option>Debit Card</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Note <span className="optional">(optional)</span></label>
              <input
                type="text"
                placeholder="Add a note for this deposit..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button className="deposit-btn" onClick={handleDeposit} disabled={loading}>
              {loading ? <FaSpinner className="spin" /> : <FaArrowDown />}
              {loading ? 'Processing...' : 'Deposit Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="deposit-modal-overlay">
          <div className="deposit-modal">
            <div className="success-ring"><FaCheckCircle className="success-icon" /></div>
            <h2>Deposit Successful!</h2>
            <p className="success-sub">Your funds have been added to your account</p>
            <div className="modal-details">
              {[
                ['Amount', `₦${parseFloat(amount).toLocaleString()}`],
                ['Method', method],
                ['Date', new Date().toLocaleString()],
                ['Reference', successRef],
                ...(note ? [['Note', note]] : []),
              ].map(([label, value]) => (
                <div className="modal-detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button className="modal-done-btn" onClick={closeSuccess}>Done</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMsg && (
        <div className="deposit-modal-overlay">
          <div className="deposit-modal">
            <div className="error-ring"><FaTimes className="error-icon" /></div>
            <h2>Oops!</h2>
            <p className="success-sub">{errorMsg}</p>
            <button className="modal-done-btn error" onClick={() => setErrorMsg('')}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPage;