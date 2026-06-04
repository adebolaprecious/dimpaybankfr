import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSpinner, FaBars, FaSnowflake, FaSyncAlt, FaFlag,
  FaShieldAlt, FaWifi, FaEye, FaEyeSlash, FaCreditCard
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Heading from "../components/Heading";
import "./CardPage.css";

const CardsPage = () => {
  const [wallet, setWallet] = useState(null);
  const [userName, setUserName] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => { fetchWallet(); }, []);

  const fetchWallet = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${user.id}`);
      setWallet(res.data.wallet);
      setUserName(res.data.username);
    } catch (error) {
      console.log(error);
    }
  };

  const maskAccount = (num) => {
    if (!num) return "•••• •••• ••••";
    const s = String(num);
    return s.slice(0, 4) + " •••• " + s.slice(-4);
  };

  if (!wallet) {
    return (
      <div className="cp-loading">
        <FaSpinner className="cp-spinner" />
        <p>Fetching card details…</p>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <div className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
        <Sidebar />
      </div>

      <div className="cp-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <Heading title="DimPay Bank" />

        <div className="cp-body">
          {/* Top section: card + actions */}
          <div className="cp-top">

            {/* 3D Flip Card */}
            <div className="cp-card-scene" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`cp-card ${isFlipped ? "flipped" : ""} ${frozen ? "frozen" : ""}`}>

                {/* Front */}
                <div className="cp-card-front">
                  <div className="cp-card-top">
                    <span className="cp-card-brand">DimPay</span>
                    <FaWifi className="cp-nfc-icon" />
                  </div>
                  <div className="cp-chip" />
                  <div className="cp-card-number">
                    {showAccount ? wallet.accountNumber : maskAccount(wallet.accountNumber)}
                    <button
                      className="cp-eye"
                      onClick={e => { e.stopPropagation(); setShowAccount(!showAccount); }}
                    >
                      {showAccount ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="cp-card-bottom">
                    <div>
                      <div className="cp-card-label">Card Holder</div>
                      <div className="cp-card-value">{userName}</div>
                    </div>
                    <div>
                      <div className="cp-card-label">Expires</div>
                      <div className="cp-card-value">12/28</div>
                    </div>
                    <div className="cp-visa">VISA</div>
                  </div>
                  {frozen && <div className="cp-frozen-overlay"><FaSnowflake /> Card Frozen</div>}
                </div>

                {/* Back */}
                <div className="cp-card-back">
                  <div className="cp-magstripe" />
                  <div className="cp-cvv-row">
                    <div className="cp-sig-strip">
                      <span>Authorized Signature</span>
                      <div className="cp-sig-lines" />
                    </div>
                    <div className="cp-cvv-box">
                      <div className="cp-cvv-label">CVV</div>
                      <div className="cp-cvv">•••</div>
                    </div>
                  </div>
                  <p className="cp-back-note">
                    This card is the property of DimPay Bank. Unauthorized use is strictly prohibited.
                  </p>
                  <div className="cp-back-visa">VISA</div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="cp-actions">
              <p className="cp-actions-hint">Tap the card to flip it</p>

              <button
                className={`cp-action-btn ${frozen ? "active-freeze" : ""}`}
                onClick={() => setFrozen(!frozen)}
              >
                <div className="cp-action-icon freeze"><FaSnowflake /></div>
                <div className="cp-action-text">
                  <span>{frozen ? "Unfreeze Card" : "Freeze Card"}</span>
                  <small>{frozen ? "Card is currently frozen" : "Temporarily disable card"}</small>
                </div>
              </button>

              <button className="cp-action-btn">
                <div className="cp-action-icon replace"><FaSyncAlt /></div>
                <div className="cp-action-text">
                  <span></span>
                  <small></small>
                </div>
              </button>

              <button className="cp-action-btn danger">
                <div className="cp-action-icon report"><FaFlag /></div>
                <div className="cp-action-text">
                  {/* <span>Report Lost</span>
                  <small>Block and report card</small> */}
                </div>
              </button>
            </div>
          </div>

          {/* Bottom: stats */}
          <div className="cp-stats">
            <div className="cp-stat-card">
              <div className="cp-stat-icon balance"><FaCreditCard /></div>
              <div>
                <div className="cp-stat-label">Available Balance</div>
                <div className="cp-stat-value">₦{wallet.balance?.toLocaleString()}</div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon type"><FaShieldAlt /></div>
              <div>
                <div className="cp-stat-label">Card Type</div>
                <div className="cp-stat-value">Visa Debit</div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon status"><span className="cp-status-dot" /></div>
              <div>
                <div className="cp-stat-label">Card Status</div>
                <div className={`cp-stat-value ${frozen ? "text-frozen" : "text-active"}`}>
                  {frozen ? "Frozen" : "Active"}
                </div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon acct"><FaCreditCard /></div>
              <div>
                <div className="cp-stat-label">Account Number</div>
                <div className="cp-stat-value">{wallet.accountNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;