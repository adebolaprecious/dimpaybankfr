import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaExchangeAlt, FaWallet, FaSearch,
  FaTimes, FaArrowUp, FaArrowDown, FaMobileAlt,
  FaTv, FaMoneyBillWave, FaDatabase, FaChartBar,
  FaSignOutAlt, FaEye, FaCalendarAlt, FaHashtag,
  FaCheckCircle, FaTimesCircle, FaClock, FaFilter
} from 'react-icons/fa';
import './AdminDashboard.css';

const cookies = new Cookies();

const debitTypes = ['transfer', 'withdrawal', 'airtime', 'data', 'gotv', 'dstv', 'startimes'];

const getIcon = (type) => {
  const map = {
    transfer: <FaExchangeAlt />,
    withdrawal: <FaArrowUp />,
    deposit: <FaMoneyBillWave />,
    airtime: <FaMobileAlt />,
    data: <FaDatabase />,
    gotv: <FaTv />, dstv: <FaTv />, startimes: <FaTv />,
  };
  return map[type?.toLowerCase()] || <FaMoneyBillWave />;
};

const getStatusIcon = (status) => {
  if (status === 'success') return <FaCheckCircle className="status-icon success" />;
  if (status === 'failed') return <FaTimesCircle className="status-icon failed" />;
  return <FaClock className="status-icon pending" />;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTx, setSearchTx] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [txFilter, setTxFilter] = useState('all');

  const token = cookies.get('token');
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchStats(); fetchUsers(); fetchAllTransactions(); }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/admin/stats`, authHeader);
      setStats(res.data.stats);
    } catch (e) { console.log(e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/admin/users`, authHeader);
      setUsers(res.data.users);
    } catch (e) { console.log(e); }
  };

  const fetchAllTransactions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/admin/transactions`, authHeader);
      setAllTransactions(res.data.transactions);
    } catch (e) { console.log(e); }
  };

  const fetchUserTransactions = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/admin/users/${userId}/transactions`,
        authHeader
      );
      setUserTransactions(res.data.transactions);
      setSelectedUser({ ...res.data.user, wallet: res.data.wallet });
      setActiveTab('userDetail');
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const fetchTransactionById = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/admin/transactions/${id}`,
        authHeader
      );
      setSelectedTransaction(res.data.transaction);
    } catch (e) { console.log(e); }
  };

  const handleLogout = () => {
    cookies.remove('token');
    localStorage.clear();
    navigate('/login');
  };

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredTx = allTransactions.filter(tx => {
    const matchSearch = tx.reference?.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.type?.toLowerCase().includes(searchTx.toLowerCase());
    const matchFilter = txFilter === 'all' ? true :
      txFilter === 'debit' ? debitTypes.includes(tx.type?.toLowerCase()) :
      !debitTypes.includes(tx.type?.toLowerCase());
    return matchSearch && matchFilter;
  });

  const filteredUserTx = userTransactions.filter(tx =>
    txFilter === 'all' ? true :
    txFilter === 'debit' ? debitTypes.includes(tx.type?.toLowerCase()) :
    !debitTypes.includes(tx.type?.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <FaChartBar />
          <span>DimPay Admin</span>
        </div>

        <nav className="admin-nav">
          {[
            { id: 'overview', icon: <FaChartBar />, label: 'Overview' },
            { id: 'users', icon: <FaUsers />, label: 'Users' },
            { id: 'transactions', icon: <FaExchangeAlt />, label: 'Transactions' },
          ].map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSelectedUser(null); }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">
              {adminUser?.firstName?.charAt(0)}{adminUser?.lastName?.charAt(0)}
            </div>
            <div>
              <p>{adminUser?.firstName} {adminUser?.lastName}</p>
              <small>Administrator</small>
            </div>
          </div>
          <button className="admin-logout" onClick={handleLogout}><FaSignOutAlt /></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {adminUser?.firstName}</p>
            </div>

            <div className="admin-stats-grid">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'purple' },
                { label: 'Total Transactions', value: stats?.totalTransactions || 0, icon: <FaExchangeAlt />, color: 'blue' },
                { label: 'Total Balance', value: `₦${(stats?.totalBalance || 0).toLocaleString()}`, icon: <FaWallet />, color: 'green' },
                { label: "Today's Transactions", value: stats?.todayTx || 0, icon: <FaCalendarAlt />, color: 'orange' },
              ].map((s, i) => (
                <div className={`admin-stat-card ${s.color}`} key={i}>
                  <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
                  <div>
                    <p>{s.label}</p>
                    <h3>{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Recent Transactions</h3>
                <button className="view-all-btn" onClick={() => setActiveTab('transactions')}>View All</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.slice(0, 8).map((tx) => {
                      const isDebit = debitTypes.includes(tx.type?.toLowerCase());
                      return (
                        <tr key={tx._id} onClick={() => setSelectedTransaction(tx)} className="table-row-click">
                          <td>
                            <div className={`tx-type-badge ${isDebit ? 'debit' : 'credit'}`}>
                              {getIcon(tx.type)} {tx.type}
                            </div>
                          </td>
                          <td className="tx-desc">{tx.description || '-'}</td>
                          <td className={`tx-amt ${isDebit ? 'debit' : 'credit'}`}>
                            {isDebit ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                          </td>
                          <td>{getStatusIcon(tx.status)}</td>
                          <td className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td><FaEye className="eye-icon" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1>All Users</h1>
              <p>{users.length} registered users</p>
            </div>

            <div className="admin-search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            <div className="users-grid">
              {filteredUsers.map((u) => (
                <div className="user-card" key={u._id} onClick={() => fetchUserTransactions(u._id)}>
                  <div className="user-card-avatar">
                    {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                  </div>
                  <div className="user-card-info">
                    <h4>{u.firstName} {u.lastName}</h4>
                    <p>{u.email}</p>
                    <small>{u.phoneNumber}</small>
                  </div>
                  <div className="user-card-stats">
                    <div className="user-stat">
                      <span>Balance</span>
                      <strong>₦{(u.wallet?.balance || 0).toLocaleString()}</strong>
                    </div>
                    <div className="user-stat">
                      <span>Transactions</span>
                      <strong>{u.transactionCount}</strong>
                    </div>
                  </div>
                  <FaEye className="user-card-eye" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── User Detail Tab ── */}
        {activeTab === 'userDetail' && selectedUser && (
          <div className="admin-content">
            <button className="back-btn" onClick={() => { setActiveTab('users'); setSelectedUser(null); }}>
              ← Back to Users
            </button>

            <div className="user-detail-header">
              <div className="user-detail-avatar">
                {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
              </div>
              <div>
                <h1>{selectedUser.firstName} {selectedUser.lastName}</h1>
                <p>{selectedUser.email} • {selectedUser.phoneNumber}</p>
              </div>
              <div className="user-detail-balance">
                <span>Wallet Balance</span>
                <h2>₦{(selectedUser.wallet?.balance || 0).toLocaleString()}</h2>
                <small>{selectedUser.wallet?.accountNumber}</small>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Transaction History ({userTransactions.length})</h3>
                <div className="filter-tabs">
                  {['all', 'debit', 'credit'].map(f => (
                    <button key={f} className={`filter-tab ${txFilter === f ? 'active' : ''}`}
                      onClick={() => setTxFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserTx.map((tx) => {
                      const isDebit = debitTypes.includes(tx.type?.toLowerCase());
                      return (
                        <tr key={tx._id} onClick={() => setSelectedTransaction(tx)} className="table-row-click">
                          <td>
                            <div className={`tx-type-badge ${isDebit ? 'debit' : 'credit'}`}>
                              {getIcon(tx.type)} {tx.type}
                            </div>
                          </td>
                          <td className="tx-desc">{tx.description || '-'}</td>
                          <td className={`tx-amt ${isDebit ? 'debit' : 'credit'}`}>
                            {isDebit ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                          </td>
                          <td className="tx-ref">{tx.reference}</td>
                          <td>{getStatusIcon(tx.status)}</td>
                          <td className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td><FaEye className="eye-icon" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Transactions Tab ── */}
        {activeTab === 'transactions' && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1>All Transactions</h1>
              <p>{allTransactions.length} total transactions</p>
            </div>

            <div className="tx-controls">
              <div className="admin-search-bar">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by reference, type, description..."
                  value={searchTx}
                  onChange={(e) => setSearchTx(e.target.value)}
                />
              </div>
              <div className="filter-tabs">
                {['all', 'debit', 'credit'].map(f => (
                  <button key={f} className={`filter-tab ${txFilter === f ? 'active' : ''}`}
                    onClick={() => setTxFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map((tx) => {
                      const isDebit = debitTypes.includes(tx.type?.toLowerCase());
                      return (
                        <tr key={tx._id} onClick={() => setSelectedTransaction(tx)} className="table-row-click">
                          <td>
                            <div className={`tx-type-badge ${isDebit ? 'debit' : 'credit'}`}>
                              {getIcon(tx.type)} {tx.type}
                            </div>
                          </td>
                          <td className="tx-desc">{tx.description || '-'}</td>
                          <td className={`tx-amt ${isDebit ? 'debit' : 'credit'}`}>
                            {isDebit ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                          </td>
                          <td className="tx-ref">{tx.reference}</td>
                          <td>{getStatusIcon(tx.status)}</td>
                          <td className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td><FaEye className="eye-icon" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="admin-modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Transaction Details</h3>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}><FaTimes /></button>
            </div>

            <div className="modal-tx-icon-wrap">
              <div className={`modal-tx-icon ${debitTypes.includes(selectedTransaction.type?.toLowerCase()) ? 'debit' : 'credit'}`}>
                {getIcon(selectedTransaction.type)}
              </div>
              <div className={`modal-tx-amount ${debitTypes.includes(selectedTransaction.type?.toLowerCase()) ? 'debit' : 'credit'}`}>
                {debitTypes.includes(selectedTransaction.type?.toLowerCase()) ? '-' : '+'}
                ₦{selectedTransaction.amount?.toLocaleString()}
              </div>
              <div className="modal-tx-status">
                {getStatusIcon(selectedTransaction.status)} {selectedTransaction.status}
              </div>
            </div>

            <div className="modal-details">
              {[
                ['Type', selectedTransaction.type],
                ['Description', selectedTransaction.description || '-'],
                ['Reference', selectedTransaction.reference],
                ['Recipient', selectedTransaction.recipient || '-'],
                ['Date', new Date(selectedTransaction.createdAt).toLocaleString()],
                ['Status', selectedTransaction.status],
              ].map(([label, value]) => (
                <div className="modal-detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;