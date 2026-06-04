import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Heading from '../components/Heading';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaBars, FaTimes, FaLock, FaKey, FaTrash, FaHistory,
  FaShieldAlt, FaCheckCircle, FaExclamationTriangle,
  FaEye, FaEyeSlash, FaChevronRight, FaSignOutAlt
} from 'react-icons/fa';
import './Settings.css';

const cookies = new Cookies();

const SettingsPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [pinStep, setPinStep] = useState(1);
  const [pinOTP, setPinOTP] = useState('');
  const [newPin, setNewPin] = useState('');

  const [pwStep, setPwStep] = useState(1);
  const [pwEmail, setPwEmail] = useState('');
  const [pwOTP, setPwOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = cookies.get('token');

  const showSuccess = (msg) => { setSuccessMsg(msg); setErrorMsg(''); };
  const showError = (msg) => { setErrorMsg(msg); setSuccessMsg(''); };

  const handleSendPinOTP = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/send-pin-otp`,
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess('OTP sent to your email');
      setPinStep(2);
    } catch (e) { showError(e.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleResetPin = async () => {
    if (newPin.length !== 4) return showError('PIN must be 4 digits');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/reset-pin`,
        { userId: user.id, otp: pinOTP, newPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess('Transaction PIN reset successfully!');
      setPinStep(1); setPinOTP(''); setNewPin('');
    } catch (e) { showError(e.response?.data?.message || 'Failed to reset PIN'); }
    finally { setLoading(false); }
  };

  const handleSendPwOTP = async () => {
    if (!pwEmail) return showError('Enter your email');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/forgot-password`, { email: pwEmail });
      showSuccess('OTP sent to your email');
      setPwStep(2);
    } catch (e) { showError(e.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) return showError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/reset-password`,
        { email: pwEmail, otp: pwOTP, newPassword }
      );
      showSuccess('Password reset successfully! Please log in again.');
      setTimeout(() => { cookies.remove('token'); localStorage.clear(); navigate('/login'); }, 2000);
    } catch (e) { showError(e.response?.data?.message || 'Failed to reset password'); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return showError('Type DELETE to confirm');
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/delete-account/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cookies.remove('token');
      localStorage.clear();
      navigate('/register');
    } catch (e) { showError(e.response?.data?.message || 'Failed to delete account'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    cookies.remove('token');
    localStorage.clear();
    navigate('/login');
  };

  const sections = [
    { id: 'pin', icon: <FaKey />, label: 'Reset Transaction PIN', desc: 'Change your 4-digit transaction PIN via OTP', color: 'purple' },
    { id: 'password', icon: <FaLock />, label: 'Forgot Password', desc: 'Reset your account password via email OTP', color: 'blue' },
    { id: 'history', icon: <FaHistory />, label: 'Login History', desc: 'View recent login activity on your account', color: 'green' },
    { id: 'delete', icon: <FaTrash />, label: 'Delete Account', desc: 'Permanently delete your account and all data', color: 'red' },
  ];

  const loginHistory = [
    { device: 'Chrome on Windows', location: 'Lagos, Nigeria', time: new Date().toLocaleString(), current: true },
    { device: 'Safari on iPhone', location: 'Lagos, Nigeria', time: new Date(Date.now() - 86400000).toLocaleString(), current: false },
    { device: 'Chrome on Android', location: 'Abuja, Nigeria', time: new Date(Date.now() - 172800000).toLocaleString(), current: false },
  ];

  return (
    <div className="settings-page">
      <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className="settings-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>

        <Heading title="DimPay Bank" />

        <div className="settings-container">

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="profile-info">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
              <span className="profile-badge">Premium User</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <p className="settings-section-label">Account Settings</p>

          {/* Settings Menu with inline accordion panels */}
          <div className="settings-menu">
            {sections.map((s) => (
              <div key={s.id}>

                {/* Menu Row */}
                <div
                  className={`settings-item ${activeSection === s.id ? 'active' : ''} ${s.color}`}
                  onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                >
                  <div className={`settings-item-icon ${s.color}`}>{s.icon}</div>
                  <div className="settings-item-text">
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </div>
                  <FaChevronRight className={`chevron ${activeSection === s.id ? 'open' : ''}`} />
                </div>

                {/* Inline Panel */}
                {activeSection === s.id && (
                  <div className={`settings-panel inline-panel ${s.id === 'delete' ? 'danger-panel' : ''}`}>

                    {/* Reset PIN */}
                    {s.id === 'pin' && (
                      <>
                        <h4><FaKey /> Reset Transaction PIN</h4>
                        {pinStep === 1 ? (
                          <>
                            <p className="panel-desc">
                              An OTP will be sent to <strong>{user?.email}</strong>
                            </p>
                            <button className="panel-btn" onClick={handleSendPinOTP} disabled={loading}>
                              {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="panel-form">
                              <label>Enter OTP</label>
                              <input
                                type="text"
                                maxLength="4"
                                placeholder="••••"
                                value={pinOTP}
                                onChange={(e) => setPinOTP(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                            <div className="panel-form">
                              <label>New 4-digit PIN</label>
                              <div className="pw-input-wrap">
                                <input
                                  type={showPin ? 'text' : 'password'}
                                  maxLength="4"
                                  placeholder="••••"
                                  value={newPin}
                                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                />
                                <button className="eye-btn" onClick={() => setShowPin(!showPin)}>
                                  {showPin ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            <div className="panel-actions">
                              <button className="panel-btn-ghost" onClick={() => setPinStep(1)}>Back</button>
                              <button className="panel-btn" onClick={handleResetPin} disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset PIN'}
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Reset Password */}
                    {s.id === 'password' && (
                      <>
                        <h4><FaLock /> Reset Password</h4>
                        {pwStep === 1 ? (
                          <>
                            <div className="panel-form">
                              <label>Your Email Address</label>
                              <input
                                type="email"
                                placeholder="you@example.com"
                                value={pwEmail}
                                onChange={(e) => setPwEmail(e.target.value)}
                              />
                            </div>
                            <button className="panel-btn" onClick={handleSendPwOTP} disabled={loading}>
                              {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="panel-form">
                              <label>Enter OTP</label>
                              <input
                                type="text"
                                maxLength="4"
                                placeholder="••••"
                                value={pwOTP}
                                onChange={(e) => setPwOTP(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                            <div className="panel-form">
                              <label>New Password</label>
                              <div className="pw-input-wrap">
                                <input
                                  type={showPin ? 'text' : 'password'}
                                  placeholder="Min 6 characters"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button className="eye-btn" onClick={() => setShowPin(!showPin)}>
                                  {showPin ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            <div className="panel-actions">
                              <button className="panel-btn-ghost" onClick={() => setPwStep(1)}>Back</button>
                              <button className="panel-btn" onClick={handleResetPassword} disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Login History */}
                    {s.id === 'history' && (
                      <>
                        <h4><FaHistory /> Login History</h4>
                        <p className="panel-desc">Recent login sessions for your account</p>
                        <div className="history-list">
                          {loginHistory.map((h, i) => (
                            <div className="history-item" key={i}>
                              <div className="history-icon"><FaShieldAlt /></div>
                              <div className="history-info">
                                <strong>{h.device}</strong>
                                <span>{h.location} • {h.time}</span>
                              </div>
                              {h.current && <span className="current-badge">Current</span>}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Delete Account */}
                    {s.id === 'delete' && (
                      <>
                        <h4><FaExclamationTriangle /> Delete Account</h4>
                        <p className="panel-desc danger-desc">
                          This will permanently delete your account, wallet, and all transaction history.
                          This action <strong>cannot be undone</strong>.
                        </p>
                        <div className="panel-form">
                          <label>Type <strong>DELETE</strong> to confirm</label>
                          <input
                            type="text"
                            placeholder="DELETE"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                          />
                        </div>
                        <button className="panel-btn danger" onClick={handleDeleteAccount} disabled={loading}>
                          {loading ? 'Deleting...' : 'Delete My Account'}
                        </button>
                      </>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {successMsg && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="modal-icon success"><FaCheckCircle /></div>
            <h3>Success</h3>
            <p>{successMsg}</p>
            <button className="modal-btn" onClick={() => setSuccessMsg('')}>Done</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMsg && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="modal-icon error"><FaTimes /></div>
            <h3>Oops!</h3>
            <p>{errorMsg}</p>
            <button className="modal-btn error" onClick={() => setErrorMsg('')}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;