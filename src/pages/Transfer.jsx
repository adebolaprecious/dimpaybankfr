import "./Transfer.css";
import { FaUniversity, FaCheckCircle, FaSpinner, FaBars, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import Sidebar from "../components/Sidebar";
import Heading from "../components/Heading";

const cookies = new Cookies();

const TransferMoney = () => {
  const [wallet, setWallet] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [collapsed, setCollapsed] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { fetchWallet(); }, []);

  const fetchWallet = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/wallet/${user.id}`);
      setWallet(res.data);
    } catch (err) { console.log(err); }
  };

  const handleContinue = () => {
    if (!recipientAccount || !bankName || !amount) {
      setErrorMsg("Please fill all required fields");
      return;
    }
    if (Number(amount) <= 50) {
      setErrorMsg("Amount must be greater than ₦50");
      return;
    }
    if (Number(amount) > wallet?.wallet?.balance) {
      setErrorMsg("Insufficient funds");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = async () => {
    if (pin.length !== 4) {
      setErrorMsg("Please enter a valid 4-digit PIN");
      return;
    }
    setShowConfirmModal(false);
    setStatus("pending");
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = cookies.get("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/transfer`,
        { senderId: user.id, recipientId: recipientAccount, amount: Number(amount), bankName, description, pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("success");
      setShowSuccess(true);
      setRecipientName(""); setRecipientAccount(""); setBankName("");
      setAmount(""); setDescription(""); setPin("");
      await fetchWallet();
    } catch (error) {
      setStatus("error");
      setErrorMsg(error.response?.data?.message || "Transfer failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="transfer-page">
      <div className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
        <Sidebar />
      </div>

      <div className="transfer-main">
        <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <Heading title="DimPay Bank" />

        {!wallet ? (
          <div className="pending-overlay">
            <div className="pending-content">
              <FaSpinner className="spinner" />
              <h3>Fetching Wallet...</h3>
            </div>
          </div>
        ) : (
          <div className="transfer-container">
            <div className="transfer-header">
              <div className="transfer-title">
                <FaPaperPlane className="title-icon" />
                <div>
                  <h2>Send Money</h2>
                  <p>Fast, secure transfers to any account</p>
                </div>
              </div>
              <div className="balance-chip">
                <span className="balance-label">Available</span>
                <span className="balance-amount">₦{wallet?.wallet?.balance?.toLocaleString() || 0}</span>
              </div>
            </div>

            <div className="transfer-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input type="text" placeholder="Full name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    <option value="">Select Bank</option>
                    <option>Dimpay</option>
                    <option>Access Bank</option>
                    <option>UBA</option>
                    <option>First Bank</option>
                    <option>Zenith Bank</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Account Number</label>
                  <input type="text" placeholder="0000000000" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Amount (₦)</label>
                  <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description <span className="optional">(optional)</span></label>
                <input type="text" placeholder="What's this for?" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button className="transfer-btn" onClick={handleContinue}>
                <FaPaperPlane /> Send Money
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-wrap"><FaUniversity /></div>
            <h3>Confirm Transfer</h3>
            <div className="modal-summary">
              <div className="summary-row"><span>Bank</span><strong>{bankName}</strong></div>
              <div className="summary-row"><span>Account</span><strong>{recipientAccount}</strong></div>
              <div className="summary-row"><span>Recipient</span><strong>{recipientName || "N/A"}</strong></div>
              <div className="summary-row highlight"><span>Amount</span><strong>₦{Number(amount).toLocaleString()}</strong></div>
            </div>
            <div className="pin-section">
              <label>Enter Transaction PIN</label>
              <input type="password" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" className="pin-input" />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmTransfer} disabled={loading}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-ring"><FaCheckCircle className="success-icon" /></div>
            <h2>Transfer Successful!</h2>
            <p className="success-amount">₦{Number(amount).toLocaleString()}</p>
            <p className="success-sub">has been sent successfully</p>
            <div className="success-details">
              <div className="summary-row"><span>To</span><strong>{recipientName || recipientAccount}</strong></div>
              <div className="summary-row"><span>Bank</span><strong>{bankName}</strong></div>
            </div>
            <button className="success-close-btn" onClick={() => { setShowSuccess(false); setStatus("idle"); }}>Done</button>
          </div>
        </div>
      )}

      {status === "pending" && (
        <div className="pending-overlay">
          <div className="pending-content">
            <FaSpinner className="spinner" />
            <h3>Processing...</h3>
            <p>Please don't close this page</p>
          </div>
        </div>
      )}
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

export default TransferMoney;