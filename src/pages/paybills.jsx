import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Heading from '../components/Heading';
import {
  FaBars, FaBolt, FaTint, FaWifi, FaTv, FaMobileAlt,
  FaCheckCircle, FaTimes, FaSpinner, FaDatabase, FaLock
} from 'react-icons/fa';
import './paybills.css';

const cookies = new Cookies();

const networks = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];
const airtimeAmounts = [100, 200, 500, 1000, 2000, 5000];
const dataPlans = [
  { label: '500MB', amount: 300, duration: '1 Day' },
  { label: '1GB', amount: 500, duration: '7 Days' },
  { label: '2GB', amount: 1000, duration: '30 Days' },
  { label: '5GB', amount: 2000, duration: '30 Days' },
  { label: '10GB', amount: 3500, duration: '30 Days' },
  { label: '20GB', amount: 6000, duration: '30 Days' },
];
const tvProviders = [
  { name: 'DStv', serviceType: 'dstv', plan: 'Compact Plus', amount: 10500, smartCardDigits: 10 },
  { name: 'GOtv', serviceType: 'gotv', plan: 'Supa', amount: 6200, smartCardDigits: 10 },
  { name: 'Startimes', serviceType: 'startimes', plan: 'Classic', amount: 3800, smartCardDigits: 12 },
];
const quickBills = [
  { label: 'Electricity', icon: <FaBolt /> },
  { label: 'Water', icon: <FaTint /> },
  { label: 'Internet', icon: <FaWifi /> },
  { label: 'TV', icon: <FaTv /> },
];

const PayBills = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedAirtime, setSelectedAirtime] = useState(500);
  const [selectedData, setSelectedData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState(null); // holds the pending order
  const [pin, setPin] = useState('');

  const openConfirm = (order) => {
    setPin('');
    setConfirmModal(order);
  };

  const handleBuyService = async ({ serviceType, provider, amount, phone, smartCard }) => {
    if (pin.length !== 4) {
      setErrorMsg('Please enter a valid 4-digit PIN');
      return;
    }
    setConfirmModal(null);
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = cookies.get('token');
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/buy-service`,
        {
          userId: user.id,
          serviceType,
          provider,
          amount,
          pin,
          ...(phone && { phoneNumber: phone }),
          ...(smartCard && { smartCardNumber: smartCard }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg(res.data.message || 'Payment successful!');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
      setPin('');
    }
  };

  const handleAirtime = () => {
    if (!selectedNetwork) return setErrorMsg('Please select a network');
    if (!phoneNumber || phoneNumber.length !== 11) return setErrorMsg('Phone number must be exactly 11 digits');
    openConfirm({
      title: 'Airtime Recharge',
      rows: [
        { label: 'Network', value: selectedNetwork },
        { label: 'Phone Number', value: `0${phoneNumber.slice(1) || phoneNumber}` },
        { label: 'Amount', value: `₦${selectedAirtime.toLocaleString()}`, highlight: true },
      ],
      serviceType: 'airtime',
      provider: selectedNetwork,
      amount: selectedAirtime,
      phone: phoneNumber,
    });
  };

  const handleData = () => {
    if (!selectedNetwork) return setErrorMsg('Please select a network');
    if (!phoneNumber || phoneNumber.length !== 11) return setErrorMsg('Phone number must be exactly 11 digits');
    if (!selectedData) return setErrorMsg('Please select a data plan');
    openConfirm({
      title: 'Data Purchase',
      rows: [
        { label: 'Network', value: selectedNetwork },
        { label: 'Phone Number', value: phoneNumber },
        { label: 'Plan', value: `${selectedData.label} (${selectedData.duration})` },
        { label: 'Amount', value: `₦${selectedData.amount.toLocaleString()}`, highlight: true },
      ],
      serviceType: 'data',
      provider: selectedNetwork,
      amount: selectedData.amount,
      phone: phoneNumber,
    });
  };

  const handleTV = (tv) => {
    if (!smartCardNumber || smartCardNumber.length !== tv.smartCardDigits) {
      return setErrorMsg(`${tv.name} smart card must be exactly ${tv.smartCardDigits} digits`);
    }
    openConfirm({
      title: `${tv.name} Subscription`,
      rows: [
        { label: 'Provider', value: tv.name },
        { label: 'Plan', value: tv.plan },
        { label: 'Smart Card', value: smartCardNumber },
        { label: 'Amount', value: `₦${tv.amount.toLocaleString()}`, highlight: true },
      ],
      serviceType: tv.serviceType,
      provider: tv.name,
      amount: tv.amount,
      smartCard: smartCardNumber,
    });
  };

  return (
    <div className="paybills-page">
      <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className="paybills-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <Heading title="DimPay Bank" />

        <div className="paybills-container">
          <div className="section-title">Quick Services</div>
          <div className="bills-grid">
            {quickBills.map((b, i) => (
              <div className="bill-card" key={i}>
                <div className="bill-icon">{b.icon}</div>
                <p>{b.label}</p>
              </div>
            ))}
          </div>

          <div className="recharge-panel">
            <div className="tabs">
              {['Airtime', 'Data', 'TV Subscription'].map((tab, i) => (
                <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Airtime Tab */}
            {activeTab === 0 && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Phone Number <span className="digit-hint">(11 digits)</span></label>
                  <div className="phone-input">
                    <span>+234</span>
                    <input
                      type="tel"
                      placeholder="08012345678"
                      maxLength={11}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    />
                    <span className={`digit-counter ${phoneNumber.length === 11 ? 'done' : ''}`}>
                      {phoneNumber.length}/11
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Network</label>
                  <div className="network-grid">
                    {networks.map((net) => (
                      <div key={net} className={`network-option ${selectedNetwork === net ? 'selected' : ''}`} onClick={() => setSelectedNetwork(net)}>
                        {net}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Amount</label>
                  <div className="amount-grid">
                    {airtimeAmounts.map((amt) => (
                      <div key={amt} className={`amount-btn ${selectedAirtime === amt ? 'selected' : ''}`} onClick={() => setSelectedAirtime(amt)}>
                        ₦{amt}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="pay-btn" onClick={handleAirtime} disabled={loading}>
                  {loading ? <FaSpinner className="spin" /> : <FaMobileAlt />} Pay ₦{selectedAirtime}
                </button>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 1 && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Phone Number <span className="digit-hint">(11 digits)</span></label>
                  <div className="phone-input">
                    <span>+234</span>
                    <input
                      type="tel"
                      placeholder="08012345678"
                      maxLength={11}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    />
                    <span className={`digit-counter ${phoneNumber.length === 11 ? 'done' : ''}`}>
                      {phoneNumber.length}/11
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Network</label>
                  <div className="network-grid">
                    {networks.map((net) => (
                      <div key={net} className={`network-option ${selectedNetwork === net ? 'selected' : ''}`} onClick={() => setSelectedNetwork(net)}>
                        {net}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Data Plan</label>
                  <div className="data-grid">
                    {dataPlans.map((plan) => (
                      <div key={plan.label} className={`data-card ${selectedData?.label === plan.label ? 'selected' : ''}`} onClick={() => setSelectedData(plan)}>
                        <FaDatabase className="data-icon" />
                        <p className="data-size">{plan.label}</p>
                        <p className="data-duration">{plan.duration}</p>
                        <p className="data-price">₦{plan.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="pay-btn" onClick={handleData} disabled={loading || !selectedData}>
                  {loading ? <FaSpinner className="spin" /> : <FaDatabase />}
                  {selectedData ? `Buy ${selectedData.label} — ₦${selectedData.amount.toLocaleString()}` : 'Select a Plan'}
                </button>
              </div>
            )}

            {/* TV Tab */}
            {activeTab === 2 && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Smart Card / IUC Number</label>
                  <input
                    className="plain-input"
                    type="text"
                    placeholder="Enter smart card number"
                    value={smartCardNumber}
                    onChange={(e) => setSmartCardNumber(e.target.value.replace(/\D/g, ''))}
                  />
                  <span className="tv-hint">DStv/GOtv: 10 digits · Startimes: 12 digits</span>
                </div>
                <div className="tv-grid">
                  {tvProviders.map((tv) => (
                    <div className="tv-card" key={tv.name}>
                      <div className="tv-icon"><FaTv /></div>
                      <h4>{tv.name}</h4>
                      <p>{tv.plan}</p>
                      <p className="tv-smartcard-hint">Smart card: {tv.smartCardDigits} digits</p>
                      <p className="tv-price">₦{tv.amount.toLocaleString()}</p>
                      <button className="pay-btn small" onClick={() => handleTV(tv)} disabled={loading}>
                        {loading ? <FaSpinner className="spin" /> : 'Subscribe'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {confirmModal && (
        <div className="bills-modal-overlay">
          <div className="bills-modal confirm-modal">
            <div className="confirm-modal-header">
              <h3>{confirmModal.title}</h3>
              <button className="close-modal-btn" onClick={() => setConfirmModal(null)}><FaTimes /></button>
            </div>

            <div className="confirm-summary">
              {confirmModal.rows.map((row, i) => (
                <div key={i} className={`confirm-row ${row.highlight ? 'highlight' : ''}`}>
                  <span className="confirm-label">{row.label}</span>
                  <strong className="confirm-value">{row.value}</strong>
                </div>
              ))}
            </div>

            <div className="pin-section">
              <label><FaLock /> Enter Transaction PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="• • • •"
                className="pin-input"
              />
              <span className="pin-hint">{pin.length}/4 digits</span>
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                className="confirm-btn"
                onClick={() => handleBuyService(confirmModal)}
                disabled={loading || pin.length !== 4}
              >
                {loading ? <FaSpinner className="spin" /> : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMsg && (
        <div className="bills-modal-overlay">
          <div className="bills-modal">
            <div className="modal-icon success"><FaCheckCircle /></div>
            <h3>Success!</h3>
            <p>{successMsg}</p>
            <button className="modal-btn" onClick={() => setSuccessMsg('')}>Done</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMsg && (
        <div className="bills-modal-overlay">
          <div className="bills-modal">
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

export default PayBills;