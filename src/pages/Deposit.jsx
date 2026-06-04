import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DepositStyle.css';

import { 

  FaArrowUp, FaWallet, FaCheckCircle, FaTimes, FaUser 

} from 'react-icons/fa';



const DepositPage = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({

    account: 'Main Account',

    amount: '',

    method: 'Bank Transfer',

    note: ''

  });



  const [showSuccess, setShowSuccess] = useState(false);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

  };


const handleDeposit = async () => {
  try {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      userId: user.id,
      amount: Number(formData.amount)
    };

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/wallet/depositfunds`,
      payload
    );

  if (res.data.success) {
      navigate("/dashboard");
  localStorage.setItem("walletBalance", res.data.wallet.balance);
    window.dispatchEvent(new Event("walletUpdated"));

  setShowSuccess(true);
}

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Deposit failed"
    );
  }
};



  const closeSuccess = () => {

    setShowSuccess(false);

    setFormData({

      account: 'Main Account',

      amount: '',

      method: 'Bank Transfer',

      note: ''

    });

  };



  return (

    <div className="deposit-dashboard">

      {/* Sidebar */}

      <div className="deposit-sidebar">

        <div className="deposit-logo">

          <h2>FinBank</h2>

        </div>

        <nav className="nav-menu">

          <div className="nav-item"><FaWallet /> <span>Accounts</span></div>

          <div className="nav-item active"><FaArrowUp /> <span>Deposit</span></div>

          <div className="nav-item"><FaUser /> <span>Profile</span></div>

        </nav>

      </div>



      {/* Main Content */}

      <div className="main-content">

        <header className="header">

          <h1>Deposit Funds</h1>

          <div className="user-info">

            <FaUser className="user-icon" />

            <div>

              <p>John Doe</p>

              <small>john.doe@email.com</small>

            </div>

          </div>

        </header>



        <div className="form-container">

          <div className="form-card">

            <h2 className="form-title">Make a Deposit</h2>



            <div className="form-group">

              <label>Select Account</label>

              <select 

                name="account" 

                value={formData.account} 

                onChange={handleChange}

              >

                <option value="Main Account">Main Account - $14,560.00</option>

                <option value="Savings Account">Savings Account - $8,420.00</option>

                <option value="USD Account">USD Account - $1,250.00</option>

              </select>

            </div>



            <div className="form-group">

              <label>Deposit Amount ($)</label>

              <input

                type="number"

                name="amount"

                placeholder="0.00"

                value={formData.amount}

                onChange={handleChange}

                step="0.01"

              />

            </div>



            <div className="form-group">

              <label>Deposit Method</label>

              <select 

                name="method" 

                value={formData.method} 

                onChange={handleChange}

              >

                <option value="Bank Transfer">Bank Transfer</option>

                <option value="ACH Transfer">ACH Transfer</option>

                <option value="Wire Transfer">Wire Transfer</option>

                <option value="Debit Card">Debit Card</option>

              </select>

            </div>



            <div className="form-group">

              <label>Note (Optional)</label>

              <textarea

                name="note"

                placeholder="Add a note for this deposit..."

                value={formData.note}

                onChange={handleChange}

              />

            </div>



            <button className="deposit-btn" onClick={handleDeposit}>

              Deposit Now

            </button>

          </div>

        </div>

      </div>



      {/* Success Modal */}

      {showSuccess && (

        <div className="success-modal">

          <div className="success-card">

            <button className="close-btn" onClick={closeSuccess}>

              <FaTimes />

            </button>



            <FaCheckCircle className="success-icon" />

            

            <h2>Deposit Successful!</h2>

            <p className="success-subtitle">Your money has been added to your account.</p>



            <div className="success-details">

              <div className="detail-row">

                <span>Amount Deposited</span>

                <strong>${parseFloat(formData.amount).toLocaleString()}</strong>

              </div>

              <div className="detail-row">

                <span>Account</span>

                <strong>{formData.account}</strong>

              </div>

              <div className="detail-row">

                <span>Method</span>

                <strong>{formData.method}</strong>

              </div>

              <div className="detail-row">

                <span>Transaction ID</span>

                <strong>DEP-78K9X2P</strong>

              </div>

            </div>



            <button className="done-btn" onClick={closeSuccess}>

              Done

            </button>

          </div>

        </div>

      )}

    </div>

  );

};



export default DepositPage;

