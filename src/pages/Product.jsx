import React from 'react'
import "./Product.css"
const Product = () => {
  return (
      <section className="products-page">
{/* Hero Section */}
<div className="products-hero">
<p className="section-tag">OUR PRODUCTS</p>
<h1>Banking Solutions For Everyone</h1>
<p className="hero-text">
Explore our wide range of financial products designed to help you
save smarter, spend better, and grow your future with confidence.
</p>
</div>

<div className="products-grid">
<div className="product-card">
<div className="product-icon savings">💳</div>
<h3>Savings Accounts</h3>
<p>
High-interest savings accounts to help you grow your money safely
and securely.
</p>
<button>Learn More</button>
</div>

<div className="product-card">
<div className="product-icon cards">💙</div>
<h3>Credit and Debits Cards</h3>
<p>
Reward-based cards with cashback, travel benefits, and secure
payments.
</p>
<button>Learn More</button>
</div>

<div className="product-card">
<div className="product-icon loans">💚</div>
<h3>Personal Loans</h3>
<p>
Quick approvals and flexible repayment plans tailored to your
lifestyle.
</p>
<button>Learn More</button>
</div>

<div className="product-card">
<div className="product-icon investments">🟠</div>
<h3>Investments to Wealth</h3>
<p>
Grow your wealth confidently with smart investment plans and expert
guidance.
</p>
<button>Learn More</button>
</div>
</div>

{/* Why Choose Products */}
<div className="products-benefits">
<h2>Why Choose Our Products?</h2>

<div className="benefits-grid">
<div className="benefit-box">
<h3>Fast Approval</h3>
<p>
Quick onboarding and approval process without unnecessary delays.
</p>
</div>

<div className="benefit-box">
<h3>Secure Transactions</h3>
<p>
Industry-leading protection for all your payments and transfers.
</p>
</div>

<div className="benefit-box">
<h3>Flexible Plans</h3>
<p>
Financial solutions customized for students, workers, and
businesses.
</p>
</div>

<div className="benefit-box">
<h3>24/7 Support</h3>
<p>
Friendly customer service always ready to help anytime you need.
</p>
</div>
</div>
</div>

{/* Team Section */}
<div className="product-team">
<h2>Meet Our Product Experts</h2>

<div className="team-grid">
<div className="team-card">
<img
src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
alt="Product Manager"
/>
<h3>Jessica Moore</h3>
<p>Senior Product Manager</p>
</div>

<div className="team-card">
<img
src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
alt="Advisor"
/>
<h3>Daniel Smith</h3>
<p>Investment Advisor</p>
</div>

<div className="team-card">
<img
src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
alt="Consultant"
/>
<h3>Olivia Brown</h3>
<p>Loan Consultant</p>
</div>
</div>
</div>
</section>
  )
}

export default Product
