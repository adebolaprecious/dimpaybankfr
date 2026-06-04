
import React from 'react'
import "./OtpVerification.css"
import { useLocation } from "react-router-dom"

import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"

const OtpVerification = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ""

  const formik = useFormik({

    initialValues: {
      email: location.state?.email || "",
      otp: ""
    },

    validationSchema: yup.object({

      email: yup
        .string()
        .required("Email is required")
        .email("Invalid email"),

      otp: yup
        .string()
        .required("OTP is required")
        .matches(/^[0-9]{4}$/, "OTP must be 4 digits")

    }),

    onSubmit: async (values, { setSubmitting }) => {

      try {

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/verifyotp`,
          values,
          {
            withCredentials: true
          }
        )

        console.log(response.data)

        alert(response.data.message)

        navigate("/login")

      } catch (error) {

        console.log(error.response?.data || error)

        alert(error.response?.data?.message || "OTP verification failed")

      } finally {

        setSubmitting(false)

      }

    }

  })

  return (

    <div className="otp-page">

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

            {
              formik.touched.email && formik.errors.email
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

            {
              formik.touched.otp && formik.errors.otp
              ? <small className="text-danger">{formik.errors.otp}</small>
              : ""
            }

            <button
              type="submit"
              disabled={formik.isSubmitting}
            >
              {
                formik.isSubmitting
                ? "Verifying..."
                : "Verify OTP"
              }
            </button>

            <p className="login-link">
              Already verified? <a href="/login">Login here</a>
            </p>

          </form>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="otp-right">

        <img
          src="/bankingappimage.png"
          alt="OTP Verification"
        />

      </div>

    </div>

  )

}

export default OtpVerification