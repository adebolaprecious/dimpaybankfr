import React, { useState } from 'react'
import "./OtpVerification.css"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"

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

// ── OtpVerification Component ────────────────────────────
const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [modal, setModal] = useState(null);

  const showModal = (type, title, message, buttonText = 'OK') => {
    setModal({ type, title, message, buttonText });
  };

  const handleModalClose = () => {
    if (modal?.type === 'success') {
      navigate('/login');
    }
    setModal(null);
  };

  const formik = useFormik({
    initialValues: {
      email: location.state?.email || "",
      otp: ""
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email"),
      otp: yup.string().required("OTP is required").matches(/^[0-9]{4}$/, "OTP must be 4 digits")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/verifyotp`,
          values,
          { withCredentials: true }
        );

        showModal(
          'success',
          'Account verified!',
          response.data.message || 'Your account has been successfully verified. You can now log in.',
          'Go to login'
        );

      } catch (error) {
        showModal(
          'error',
          'Verification failed',
          error.response?.data?.message || 'Invalid or expired OTP. Please try again.',
          'Try again'
        );
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="otp-page">
      <Modal modal={modal} onClose={handleModalClose} />

      {/* LEFT SIDE */}
      <div className="otp-left">
        <div className="logo">
          <h2>DimPay</h2>
        </div>

        <div className="otp-content">
          <h1>Verify Your Account</h1>
          <p>
            Enter the secure 4-digit verification code sent to your email
            to activate your DimPay banking account.
          </p>

          <form className="otp-form" onSubmit={formik.handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email
              ? <small className="text-danger">{formik.errors.email}</small>
              : email && <small className="text-success">OTP sent to {email}</small>
            }

            <label>OTP Code</label>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              name="otp"
              maxLength={4}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
              className="otp-input"
            />
            {formik.touched.otp && formik.errors.otp &&
              <small className="text-danger">{formik.errors.otp}</small>
            }

            <button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="login-link">
              Already verified? <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="otp-right">
        <img src="/bankingappimage.png" alt="OTP Verification" />
      </div>
    </div>
  );
};

export default OtpVerification;