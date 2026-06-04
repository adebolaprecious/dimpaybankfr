import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landingpage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="lp-root">

      {/* ── Navbar ── */}
      {/* <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-icon">🏦</span>
          <span className="lp-nav-name">DimPay</span>
        </div>
        <div className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#products">Products</a>
          <a href="#stats">Stats</a>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="lp-btn-solid" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </nav> */}

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <div className="lp-badge">✨ We just shipped v1.1!</div>
          <h1 className="lp-heading">
            Banking Made<br />
            <span className="lp-highlight">Simple, Secure</span><br />
            and Smart.
          </h1>
          <p className="lp-subtext">
            Manage your money, make payments and grow your wealth — all in one place.
          </p>
          <div className="lp-features-row">
            <span className="lp-feature-pill">🔒 Bank-level security</span>
            <span className="lp-feature-pill">✅ Verified members only</span>
          </div>
          <div className="lp-cta-row">
            <button className="lp-btn-solid lg" onClick={() => navigate('/login')}>Get Started Free</button>
            <button className="lp-btn-ghost lg" onClick={() => navigate('/register')}>Learn More</button>
          </div>
        </div>

        <div className="lp-hero-right">
          {/* Floating stat top */}
          <div className="lp-float lp-float-top">
            <div className="lp-float-icon">↔️</div>
            <div>
              <div className="lp-float-label">Transaction volume</div>
              <div className="lp-float-val">₦2.4M+</div>
            </div>
          </div>

          {/* Phone */}
          <div className="lp-phone">
            <div className="lp-phone-screen">
              <div className="lp-phone-header">
                <span>DIMPAY</span>
                <span>Welcome back 👋</span>
              </div>
              <div className="lp-phone-balance">
                <div className="lp-phone-bal-label">Available Balance</div>
                <div className="lp-phone-bal-amount">₦11,123,700</div>
              </div>
              <div className="lp-phone-label">Recent Transactions</div>
              <div className="lp-phone-tx">
                <div className="lp-phone-tx-row"><span>Transfer</span><span className="red">-₦5,000</span></div>
                <div className="lp-phone-tx-row"><span>Deposit</span><span className="green">+₦50,000</span></div>
                <div className="lp-phone-tx-row"><span>Airtime</span><span className="red">-₦1,000</span></div>
              </div>
              <div className="lp-phone-actions">
                <div className="lp-phone-action">Add Cash</div>
                <div className="lp-phone-action">Withdraw</div>
                <div className="lp-phone-action">Send Cash</div>
              </div>
            </div>
          </div>

          {/* Floating stat bottom */}
          <div className="lp-float lp-float-bottom">
            <span>👥</span>
            <div>
              <div className="lp-float-label">Trusted by</div>
              <div className="lp-float-val">100+ Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="lp-section" id="features">
        <div className="lp-section-label">Why DimPay</div>
        <h2 className="lp-section-title">Built for modern banking</h2>
        <div className="lp-cards-grid">
          {[
            { icon: '🔒', title: 'Secure Banking', desc: 'Top-level encryption keeps your money and data safe at all times.' },
            { icon: '⚡', title: 'Easy Payments', desc: 'Send and receive money instantly with zero stress.' },
            { icon: '📊', title: 'Smart Analytics', desc: 'Track expenses and grow your savings with real-time insights.' },
            { icon: '🛟', title: '24/7 Support', desc: "We're here for you anytime, anywhere — day or night." },
          ].map((c) => (
            <div className="lp-card" key={c.title}>
              <div className="lp-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section className="lp-section lp-section-alt" id="products">
        <div className="lp-section-label">Our Products</div>
        <h2 className="lp-section-title">Everything you need</h2>
        <div className="lp-cards-grid">
          {[
            { icon: '💰', title: 'Savings Accounts', desc: 'High interest rates & secure savings plans.' },
            { icon: '💳', title: 'Credit Cards', desc: 'Flexible rewards and valuable cashback.' },
            { icon: '🏦', title: 'Personal Loans', desc: 'Quick approval and low interest rates.' },
            { icon: '📈', title: 'Invest Funds', desc: 'Grow your wealth and funds with confidence.' },
          ].map((c) => (
            <div className="lp-card lp-card-product" key={c.title}>
              <div className="lp-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <button className="lp-card-btn">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats" id="stats">
        {[
          { val: '2M+', label: 'Happy Customers' },
          { val: '250+', label: 'Branches Worldwide' },
          { val: '99.9%', label: 'Uptime' },
          { val: '15+', label: 'Years of Trust' },
        ].map((s) => (
          <div className="lp-stat" key={s.label}>
            <h2>{s.val}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <div>
            <h2>Ready for the future of banking?</h2>
            <p>Open an account in minutes and take control of your finances.</p>
            <button className="lp-btn-solid lg" onClick={() => navigate('/register')}>
              Open Account Now
            </button>
          </div>
          <div className="lp-cta-icon">🏦</div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <span className="lp-nav-icon">🏦</span>
          <span>DimPay</span>
        </div>
        <p>© 2025 DimPay. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;