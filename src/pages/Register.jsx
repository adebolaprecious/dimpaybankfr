import React from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "./Register.css"
import { Formik, useFormik } from 'formik'
import Cookies from "universal-cookie"

import * as yup from "yup"

const Register = () => {
const cookies = new Cookies();
const navigate = useNavigate()
  const formik = useFormik ({
    initialValues:{
      firstName:"",
      lastName:"",
      phoneNumber:"",
      email:"",
      password:""

    },

    validationSchema:yup.object({
     firstName:yup.string().required("first name is required"),
        lastName:yup.string().required("last name is required"),
        phoneNumber:yup.string().required("enter your phone number").matches(/^[0-9]{11}$/, "phone number is invalid").min(11, "phone number is invalid").max(11, "phone number is invalid"),
        email:yup.string().required("email is required").email("email is invalid"),
        password:yup.string().required("password is required").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "password is to weak"),
        confirmPassword:yup.string()
.oneOf([yup.ref("password")], "passwords must match")
.required("confirm password is required")
    }),

        onSubmit: async (values, { setSubmitting }) => {
                console.log(formik.values);

          try {
               let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/registeruser`, { ...values, role:"user"});
        if (response.status === 201) {
        alert("User created successfully");
        navigate("/verifyotp", {
  state: {
    email: values.email
  }
})
        const decoded = jwtDecode(response.data.token);
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000)
        });
         
        } 
          }catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Can't create user");
    } finally {
      setSubmitting(false);
    }
         }
  })
  console.log(formik.touched);
    return (
  <div className="register-page">
{/* LEFT SIDE FORM */}
<div className="register-left">
<div className="logo">
<h2>DimPay</h2>
</div>

<div className="register-content">
<h1>Create Your Account</h1>
<p>Join DimPay-Bank Today and experience smart banking</p>

<form className="register-form" onSubmit={formik.handleSubmit}>
<div className="name-row">
<div>
<label>First Name</label>
<input type="text" placeholder="enter your firstName" name="firstName" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName}/>
{formik.touched.firstName && formik.errors.firstName ?<small className="text-danger">{formik.errors.firstName}</small>: ""}
</div>

<div>
<label>Last Name</label>
<input type="text" placeholder="enter your lastName" name='lastName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName}/>
{formik.touched.lastName && formik.errors.lastName ?<small className="text-danger">{formik.errors.lastName}</small>: ""}
</div>
</div>

<label>Email Address</label>
<input type="email" placeholder="Enter your email" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}/>
{formik.touched.email && formik.errors.email ?<small className="text-danger">{formik.errors.email}</small>: ""}
<label>Phone Number</label>
<input type="text" placeholder="Enter your phone number" name='phoneNumber' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber}/>
{formik.touched.phoneNumber && formik.errors.phoneNumber ?<small className="text-danger">{formik.errors.phoneNumber}</small>: ""}
<label>Password</label>
<input type="password" placeholder="Create password" name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}/>
{formik.touched.password && formik.errors.password ?<small className="text-danger">{formik.errors.password}</small>: ""}
<label>Confirm Password</label>
<input type="password" placeholder="Confirm password" name='confirmPassword' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}/>

<div className="terms">
<input type="checkbox" />
<span>
I agree to the Terms & Conditions and Privacy Policy
</span>
</div>

<button type="submit" disabled={formik.isSubmitting}> {formik.isSubmitting ? "Creating..." : "Create Account"}</button>

<p className="signin-link">
Already have an account? <a href="/login">Sign in here</a>
</p>
</form>
</div>
</div>

{/* RIGHT SIDE IMAGE */}
<div className="register-right">
<img
src="/bankingappimage.png"
alt="Banking Register"
/>
</div>
</div>
  )
}

export default Register
