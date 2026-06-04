import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePin.css";

// ── Modal Component ──────────────────────────────────────
const Modal = ({ modal, onClose }) => {
  if (!modal) return null;

  const isSuccess = modal.type === 'success';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderRadius: '20px',
          width: '100%', maxWidth: '380px',
          padding: '32px 28px',
          textAlign: 'center',
          fontFamily: "'Sora', sans-serif"
        }}
      >
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: isSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `2px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px', fontSize: '26px',
          color: isSuccess ? '#10b981' : '#ef4444'
        }}>
          {isSuccess ? '✓' : '✕'}
        </div>

        <h3 style={{
          fontSize: '18px', fontWeight: 700,
          color: '#fff', margin: '0 0 8px'
        }}>
          {modal.title}
        </h3>

        <p style={{
          fontSize: '14px', color: '#9ca3af',
          margin: '0 0 24px', lineHeight: '1.6'
        }}>
          {modal.message}
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: isSuccess ? '#7c3aed' : 'transparent',
            color: isSuccess ? '#fff' : '#e5e7eb',
            border: isSuccess ? 'none' : '1px solid #2e2e3e',
            borderRadius: '12px',
            fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Sora', sans-serif"
          }}
        >
          {modal.buttonText}
        </button>
      </div>
    </div>
  );
};

// ── CreatePin Component ──────────────────────────────────
const CreatePin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const showModal = (type, title, message, buttonText = 'OK') => {
    setModal({ type, title, message, buttonText });
  };

  const handleModalClose = () => {
    if (modal?.type === 'success') {
      navigate('/dashboard');
    }
    setModal(null);
  };

  const handleCreatePin = async () => {
    if (pin.length < 4) {
      return showModal('error', 'Invalid PIN', 'PIN must be exactly 4 digits.', 'Try again');
    }

    if (pin !== confirmPin) {
      return showModal('error', 'PINs do not match', 'Your PIN and confirm PIN are not the same. Please try again.', 'Try again');
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/create-pin`,
        { userId: user.id, pin }
      );

      showModal(
        'success',
        'PIN created!',
        res.data.message || 'Your transaction PIN has been set successfully.',
        'Go to dashboard'
      );

    } catch (error) {
      showModal(
        'error',
        'Failed to create PIN',
        error.response?.data?.message || 'Something went wrong. Please try again.',
        'Try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-pin-container">
      <Modal modal={modal} onClose={handleModalClose} />

      <div className="create-pin-card">
        <h2>Create Transaction PIN</h2>
        <p>Set a secure 4-digit PIN for transfers and withdrawals.</p>

        <input
          className="pin-input"
          type="password"
          maxLength="4"
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <input
          className="pin-input"
          type="password"
          maxLength="4"
          placeholder="Confirm PIN"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
        />

        <button
          className="create-pin-btn"
          onClick={handleCreatePin}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create PIN"}
        </button>
      </div>
    </div>
  );
};

export default CreatePin;