import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "./Register.css"
import { useFormik } from 'formik'
import Cookies from "universal-cookie"
import * as yup from "yup"

const cookies = new Cookies();

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
        {/* Icon */}
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

        {/* Title */}
        <h3 style={{
          fontSize: '18px', fontWeight: 700,
          color: '#fff', margin: '0 0 8px'
        }}>
          {modal.title}
        </h3>

        {/* Message */}
        <p style={{
          fontSize: '14px', color: '#9ca3af',
          margin: '0 0 24px', lineHeight: '1.6'
        }}>
          {modal.message}
        </p>

        {/* Button */}
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

// ── Register Component ───────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  const showModal = (type, title, message, buttonText = 'OK') => {
    setModal({ type, title, message, buttonText });
  };

  const handleModalClose = () => {
    if (modal?.type === 'success') {
      navigate('/verifyotp', { state: { email: formik.values.email } });
    }
    setModal(null);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "", lastName: "", phoneNumber: "",
      email: "", password: "", confirmPassword: ""
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phoneNumber: yup.string().required("Enter your phone number")
        .matches(/^[0-9]{11}$/, "Phone number is invalid"),
      email: yup.string().required("Email is required").email("Email is invalid"),
      password: yup.string().required("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Password is too weak"),
      confirmPassword: yup.string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/registeruser`,
          { ...values, role: "user" }
        );

        if (response.status === 201) {
          const decoded = jwtDecode(response.data.token);
          cookies.set("token", response.data.token, {
            expires: new Date(decoded.exp * 1000)
          });

          showModal(
            'success',
            'Account created!',
            'Your account was set up successfully. We\'ll send a verification code to your email.',
            'Continue to verify'
          );
        }
      } catch (error) {
        showModal(
          'error',
          'Registration failed',
          error.response?.data?.message || "Unable to create account. Please try again.",
          'Try again'
        );
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="register-page">
      <Modal modal={modal} onClose={handleModalClose} />

      {/* LEFT SIDE FORM */}
      <div className="register-left">
        <div className="logo"><h2>DimPay</h2></div>

        <div className="register-content">
          <h1>Create Your Account</h1>
          <p>Join DimPay-Bank today and experience smart banking</p>

          <form className="register-form" onSubmit={formik.handleSubmit}>
            <div className="name-row">
              <div>
                <label>First Name</label>
                <input type="text" placeholder="Enter your first name" name="firstName"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName} />
                {formik.touched.firstName && formik.errors.firstName &&
                  <small className="text-danger">{formik.errors.firstName}</small>}
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" placeholder="Enter your last name" name="lastName"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName} />
                {formik.touched.lastName && formik.errors.lastName &&
                  <small className="text-danger">{formik.errors.lastName}</small>}
              </div>
            </div>

            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" name="email"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
            {formik.touched.email && formik.errors.email &&
              <small className="text-danger">{formik.errors.email}</small>}

            <label>Phone Number</label>
            <input type="text" placeholder="Enter your phone number" name="phoneNumber"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber} />
            {formik.touched.phoneNumber && formik.errors.phoneNumber &&
              <small className="text-danger">{formik.errors.phoneNumber}</small>}

            <label>Password</label>
            <input type="password" placeholder="Create password" name="password"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
            {formik.touched.password && formik.errors.password &&
              <small className="text-danger">{formik.errors.password}</small>}

            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" name="confirmPassword"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword &&
              <small className="text-danger">{formik.errors.confirmPassword}</small>}

            <div className="terms">
              <input type="checkbox" />
              <span>I agree to the Terms & Conditions and Privacy Policy</span>
            </div>

            <button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Creating..." : "Create Account"}
            </button>

            <p className="signin-link">
              Already have an account? <a href="/login">Sign in here</a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="register-right">
        <img src="/bankingappimage.png" alt="Banking Register" />
      </div>
    </div>
  );
};

export default Register;