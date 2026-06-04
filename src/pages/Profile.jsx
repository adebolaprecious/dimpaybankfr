import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import {
  FaUser, FaEnvelope, FaPhone, FaWallet,
  FaCopy, FaCheckCircle, FaLock, FaEdit,
  FaSignOutAlt, FaExchangeAlt, FaMobileAlt,
  FaMoneyBillWave, FaArrowUp, FaArrowDown,
  FaShieldAlt, FaTv, FaDatabase
} from "react-icons/fa";
import "./Profile.css";

const cookies = new Cookies();

const debitTypes = ['transfer', 'withdrawal', 'airtime', 'data', 'gotv', 'dstv', 'startimes'];

const getTxIcon = (type) => {
  const t = type?.toLowerCase();
  if (t === 'transfer') return <FaExchangeAlt />;
  if (t === 'withdrawal') return <FaArrowUp />;
  if (t === 'deposit') return <FaArrowDown />;
  if (t === 'airtime') return <FaMobileAlt />;
  if (t === 'data') return <FaDatabase />;
  if (['gotv','dstv','startimes'].includes(t)) return <FaTv />;
  return <FaMoneyBillWave />;
};

// ── Modal ────────────────────────────────────────────────
const Modal = ({ modal, onClose }) => {
  if (!modal) return null;
  const isSuccess = modal.type === 'success';
  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`profile-modal-icon ${modal.type}`}>
          {isSuccess ? '✓' : '✕'}
        </div>
        <h3>{modal.title}</h3>
        <p>{modal.message}</p>
        <button className={`profile-modal-btn ${modal.type}`} onClick={onClose}>
          {modal.buttonText || 'OK'}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id;

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(null);

  const token = cookies.get("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!userId) return;
    fetchWallet();
  }, [userId]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${userId}`,
        authHeader
      );
      setWallet(res.data.wallet);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAccount = () => {
    if (!wallet?.accountNumber) return;
    navigator.clipboard.writeText(wallet.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    cookies.remove("token");
    localStorage.clear();
    navigate("/login");
  };

  const initials = `${storedUser?.firstName?.charAt(0) || ""}${storedUser?.lastName?.charAt(0) || ""}`;

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Modal modal={modal} onClose={() => setModal(null)} />

      {/* ── Hero Card ── */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h1>{storedUser?.firstName} {storedUser?.lastName}</h1>
          <p>{storedUser?.email}</p>
          <span className="profile-verified-badge">
            <FaCheckCircle /> Verified
          </span>
        </div>
        <div className="profile-balance-wrap">
          <span>Wallet Balance</span>
          <h2>₦{(wallet?.balance || 0).toLocaleString()}</h2>
          <div className="profile-account-row">
            <small>{wallet?.accountNumber}</small>
            <button className="profile-copy-btn" onClick={handleCopyAccount} title="Copy account number">
              {copied ? <FaCheckCircle style={{ color: '#10b981' }} /> : <FaCopy />}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* ── Personal Info ── */}
        <div className="profile-card">
          <h3 className="profile-card-title">Personal Info</h3>
          <div className="profile-info-list">
            <div className="profile-info-row">
              <div className="profile-info-icon purple"><FaUser /></div>
              <div>
                <span>Full Name</span>
                <strong>{storedUser?.firstName} {storedUser?.lastName}</strong>
              </div>
            </div>
            <div className="profile-info-row">
              <div className="profile-info-icon purple"><FaEnvelope /></div>
              <div>
                <span>Email</span>
                <strong>{storedUser?.email}</strong>
              </div>
            </div>
            <div className="profile-info-row">
              <div className="profile-info-icon purple"><FaPhone /></div>
              <div>
                <span>Phone</span>
                <strong>{storedUser?.phoneNumber || '—'}</strong>
              </div>
            </div>
            <div className="profile-info-row">
              <div className="profile-info-icon purple"><FaWallet /></div>
              <div>
                <span>Account Number</span>
                <strong>{wallet?.accountNumber || '—'}</strong>
              </div>
            </div>
            <div className="profile-info-row">
              <div className="profile-info-icon purple"><FaShieldAlt /></div>
              <div>
                <span>Role</span>
                <strong style={{ textTransform: 'capitalize' }}>{storedUser?.role || 'user'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="profile-card">
          <h3 className="profile-card-title">Quick Actions</h3>
          <div className="profile-actions">
            <button
              className="profile-action-btn purple"
              onClick={() => navigate('/settings')}
            >
              <FaLock /> Change PIN
            </button>
            <button
              className="profile-action-btn blue"
              onClick={() => navigate('/settings')}
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              className="profile-action-btn green"
              onClick={() => navigate('/transactions')}
            >
              <FaExchangeAlt /> View Transactions
            </button>
            <button
              className="profile-action-btn red"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="profile-card profile-tx-card">
        <div className="profile-card-header">
          <h3 className="profile-card-title" style={{ margin: 0 }}>Recent Transactions</h3>
          <button
            className="profile-view-all"
            onClick={() => navigate('/transactions')}
          >
            View all
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="profile-empty">
            <FaExchangeAlt />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="profile-tx-list">
            {transactions.slice(0, 5).map((tx) => {
              const isDebit = debitTypes.includes(tx.type?.toLowerCase());
              return (
                <div className="profile-tx-row" key={tx._id}>
                  <div className={`profile-tx-icon ${isDebit ? 'debit' : 'credit'}`}>
                    {getTxIcon(tx.type)}
                  </div>
                  <div className="profile-tx-info">
                    <strong>{tx.description || tx.type}</strong>
                    <span>{new Date(tx.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}</span>
                  </div>
                  <span className={`profile-tx-amt ${isDebit ? 'debit' : 'credit'}`}>
                    {isDebit ? '-' : '+'}₦{tx.amount?.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;