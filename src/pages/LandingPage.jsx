import React from "react";
import "./Landingpage.css"
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="main-wrapper"> 
 <div className='hero'>
     <div className="left-section">
        <div className="badge">
          ✨ We just shipped v1.1!
        </div>
           <h1 className="main-heading">
          Banking Made simple.<br />
          <span className="highlight">Secure and Smart.</span>
        </h1>
         <p className="sub-text">
           Manage your money make payment and grow your wealth- all in one place
        </p>
          <div className="features">
          <div className="feature">🔒 Bank-level security</div>
          <div className="feature">✅ Verified members only</div>
        </div>
          <div className="cta-buttons">
          <button className="btn btn-primary" onClick={()=>(navigate('/login'))}>Get Started Free</button>
          <button className="btn btn-secondary" onClick={()=>(navigate('/about'))}>Learn More</button>
        </div>
 </div>
           <div className="phone-container">
        {/* Transaction Volume Box */}
        <div className="volume-box">
          <div style={{
            width: '42px',
            height: '42px',
            background: '#22c55e',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '25px'
          }}>
            ↔️
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#aaa', 
                transition: 'transform 0.3s ease',
               hover: { transform: "translateY(-8px)" }
            }}>Transaction volume</div>
            <div style={{ fontWeight: 600 }}>₦0</div>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="phone">
          <div className="phone-screen">
            <div className="phone-header">
              <div>DIMPAY</div>
              <div>welcome back user</div>
            </div>

            <div className="balance">
              Available Balance<br />
              <strong>₦11,123,700</strong>
            </div>

            <div style={{ marginTop: '40px', fontSize: '14px' }}>Recent Transactions</div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="action-btn">Add Cash</div>
              <div className="action-btn">Withdraw</div>
              <div className="action-btn">Send Cash</div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="trust-badge">
          👥 Trusted by<br />
          <strong>100+ Users</strong>
        </div>
      </div>
<section className="landing-section">
  {/* WHY CHOOSE FINBANK */}
  <div className="why-choose">
    <h2>Why choose FinBank?</h2>
    <div className="feature-cards">
      <div className="feature-card">
        <h1><div className="card-icon">🔒</div></h1>
        <h3>Secure Banking</h3>
        <p>Top-level security to keep your money safe.</p>
      </div>

      <div className="feature-card">
        <div className="card-icon">⚡</div>
        <h3>Easy Payments</h3>
        <p>Send and receive money instantly with zero stress.</p>
      </div>

      <div className="feature-card">
        <div className="card-icon">📊</div>
        <h3>Smart Analytics</h3>
        <p>Track expenses and grow your savings.</p>
      </div>

      <div className="feature-card">
        <div className="card-icon">🛟</div>
        <h3>24/7 Support</h3>
        <p>We’re here for you anytime, anywhere.</p>
      </div>
    </div>
  </div>

  {/* OUR PRODUCTS */}
  <div className="our-products">
    <h2>Our Products</h2>
    <div className="product-cards">
      <div className="product-card">
        <div className="card-icon">💰</div>
        <h3>Savings Accounts</h3>
        <p>High interest rates & secure savings plans.</p>
        <button>Learn More</button>
      </div>

      <div className="product-card">
        <div className="card-icon">💳</div>
        <h3>Credit Cards</h3>
        <p>Flexible rewards and value cashback.</p>
        <button>Learn More</button>
      </div>

      <div className="product-card">
        <div className="card-icon">🏦</div>
        <h3>Personal Loans</h3>
        <p>Quick approval and low interest.</p>
        <button>Learn More</button>
      </div>

      <div className="product-card">
        <div className="card-icon">📈</div>
        <h3>Invest Funds</h3>
        <p>Grow your wealth, funds with confidence.</p>
        <button>Learn More</button>
      </div>
    </div>
  </div>

  {/* STATS */}
  <div className="stats-section">
    <div className="stat-box">
      <h2>2M+</h2>
      <p>Happy Customers</p>
    </div>
    <div className="stat-box">
      <h2>250+</h2>
      <p>Branches Worldwide</p>
    </div>
    <div className="stat-box">
      <h2>99.9%</h2>
      <p>Uptime</p>
    </div>
    <div className="stat-box">
      <h2>15+</h2>
      <p>Years of Trust</p>
    </div>
  </div>

  {/* OPEN ACCOUNT NOW */}
  <div className="open-account">
    <div className="open-left">
      <h2>Ready to experience the future of banking?</h2>
      <p>Open an account in minutes and take control of your finances.</p>
      <button onClick={()=>(navigate('/register'))}>Open Account Now</button>
    </div>
    <div className="open-right">
      <div className="bank-icon">🏦</div>
    </div>
  </div>
</section>
      </div>
     </div>

  );
};

export default LandingPage;