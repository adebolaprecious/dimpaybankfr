import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaMobileAlt, FaTv, FaLightbulb, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Heading from '../components/Heading';
import './TransactionHistory.css';

const cookies = new Cookies();

const getIcon = (type) => {
  const map = {
    transfer: <FaArrowUp />,
    withdrawal: <FaArrowDown />,
    deposit: <FaMoneyBillWave />,
    airtime: <FaMobileAlt />,
    data: <FaMobileAlt />,
    gotv: <FaTv />,
    dstv: <FaTv />,
    startimes: <FaTv />,
    bill: <FaLightbulb />,
  };
  return map[type?.toLowerCase()] || <FaMoneyBillWave />;
};

const debitTypes = ['transfer', 'withdrawal', 'airtime', 'data', 'gotv', 'dstv', 'startimes'];

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = cookies.get('token');
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

  const filteredTransactions = transactions.filter((t) => {
    const isDebit = debitTypes.includes(t.type?.toLowerCase());
    if (filter === 'debit') return isDebit;
    if (filter === 'credit') return !isDebit;
    return true;
  });

  return (
    <div className="transaction-history-page">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <Heading title="DimPay Bank" />

        <div className="main-content">
          <header className="header">
            <h1>Transaction History</h1>
            <div className="header-actions">
              <div className="filter-buttons">
                {['all', 'debit', 'credit'].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="transactions-container">
            {loading ? (
              <p>Loading transactions...</p>
            ) : filteredTransactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              filteredTransactions.map((tx) => {
                const isDebit = debitTypes.includes(tx.type?.toLowerCase());
                return (
                  <div
                    key={tx._id}
                    className="transaction-item"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <div className="transaction-icon-wrapper">
                      {getIcon(tx.type)}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-main">
                        <h4>{tx.description || tx.type}</h4>
                        <p className="transaction-date">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="transaction-amount">
                        <span className={`amount ${isDebit ? 'debit' : 'credit'}`}>
                          {isDebit ? '-' : '+'}₦{tx.amount.toLocaleString()}
                        </span>
                        <span
                          className="status-dot"
                          style={{ backgroundColor: tx.status === 'success' ? '#10b981' : '#ef4444' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTransaction && (
        <div className="receipt-modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <h2>Transaction Receipt</h2>
              <button className="close-btn" onClick={() => setSelectedTransaction(null)}>
                <MdClose />
              </button>
            </div>
            <div className="receipt-card">
              <div className="receipt-icon-large">
                {getIcon(selectedTransaction.type)}
              </div>
              <div className="receipt-amount">
                <span className={`amount ${debitTypes.includes(selectedTransaction.type?.toLowerCase()) ? 'debit' : 'credit'}`}>
                  {debitTypes.includes(selectedTransaction.type?.toLowerCase()) ? '-' : '+'}
                  ₦{selectedTransaction.amount.toLocaleString()}
                </span>
              </div>
              <div className="receipt-info">
                {[
                  ['Description', selectedTransaction.description || selectedTransaction.type],
                  ['Date & Time', new Date(selectedTransaction.createdAt).toLocaleString()],
                  ['Transaction ID', selectedTransaction.reference],
                  ['Type', selectedTransaction.type],
                  ['Status', selectedTransaction.status],
                ].map(([label, value]) => (
                  <div className="info-row" key={label}>
                    <span className="label">{label}</span>
                    <span className={`value ${label === 'Status' ? 'status-success' : ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="receipt-footer">
              <p>Thank you for banking with DimPay</p>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default TransactionHistory;