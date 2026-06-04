import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" />

      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">Dim<span>pay</span></div>
          <p className="footer-tagline">Banking made simple, secure, and smart. Your money, your control.</p>
          <div className="footer-badges">
            <span className="badge-pill">🔒 256-bit SSL</span>
            <span className="badge-pill">✅ CBN Licensed</span>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links-group">
          <h4>Product</h4>
          <ul>
            <li onClick={() => navigate('/login')}>Get Started</li>
            <li onClick={() => navigate('/register')}>Open Account</li>
            <li onClick={() => navigate('/transfer')}>Transfer Money</li>
            <li>Virtual Cards</li>
            <li>Bill Payments</li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <ul>
            <li onClick={() => navigate('/about')}>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
            <li>Security</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get the latest news and updates from Dimpay.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="your@email.com" />
            <button>→</button>
          </div>
          <div className="footer-socials">
            <a href="#" className="social-icon">𝕏</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">ig</a>
            <a href="#" className="social-icon">fb</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {year} Dimpay Bank. All rights reserved.</span>
        <span className="footer-bottom-right">Made with 💜 in Nigeria</span>
      </div>
    </footer>
  );
};

export default Footer;