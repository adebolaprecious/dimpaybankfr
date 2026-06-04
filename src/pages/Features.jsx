import React from 'react'
import "./Features.css"
const Features = () => {
  return (
    <section className="features-page">
{/* Hero Section */}
<div className="features-hero">
<p className="section-tag">FEATURES</p>
<h1>Smart Banking Features Built For You</h1>
<p className="hero-text">
Experience seamless banking with powerful digital tools designed for
speed, security, and convenience anytime, anywhere.
</p>
</div>

{/* Features Grid */}
<div className="features-grid">
<div className="feature-card">
<div className="feature-icon">📱</div>
<h3>Mobile Banking</h3>
<p>
Access your finances anytime using our secure and easy-to-use
mobile banking platform.
</p>
</div>

<div className="feature-card">
<div className="feature-icon">⚡</div>
<h3>Instant Transfers</h3>
<p>
Send and receive money instantly with fast local and international
transfers.
</p>
</div>

<div className="feature-card">
<div className="feature-icon">🔒</div>
<h3>Advanced Security</h3>
<p>
Your account is protected with biometric login, encryption, and
fraud monitoring.
</p>
</div>

<div className="feature-card">
<div className="feature-icon">📊</div>
<h3>Smart Analytics</h3>
<p>
Track spending, monitor savings, and grow your finances with
detailed insights.
</p>
</div>

<div className="feature-card">
<div className="feature-icon">💬</div>
<h3>24/7 Support</h3>
<p>
Our support team is always available to help you resolve issues
quickly.
</p>
</div>

<div className="feature-card">
<div className="feature-icon">💳</div>
<h3>Easy Payments</h3>
<p>
Pay bills, subscriptions, and merchants safely in just a few taps.
</p>
</div>
</div>

{/* Team Section */}
<div className="features-team">
<h2>Meet Our Digital Experts</h2>

<div className="team-grid">
<div className="team-card">
<img
src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
alt="Digital Lead"
/>
<h3>James Wilson</h3>
<p>Head of Digital Banking</p>
</div>

<div className="team-card">
<img
src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
alt="Support Lead"
/>
<h3>Emma Taylor</h3>
<p>Customer Success Lead</p>
</div>

<div className="team-card">
<img
src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
alt="Security Lead"
/>
<h3>Sophia Clark</h3>
<p>Security Operations Manager</p>
</div>
</div>
</div>

{/* CTA Section */}
<div className="features-cta">
<div className="cta-content">
<h2>Ready To Experience Smarter Banking?</h2>
<p>
Join thousands of customers using FinBank to manage money securely,
quickly, and confidently.
</p>
<button>Open Account Now</button>
</div>
</div>
</section>

  )
}

export default Features
