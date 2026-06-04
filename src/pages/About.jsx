import React from 'react'
import "./About.css"
const About = () => {
  return (
  <section className="about-page">
{/* Hero Section */}
<div className="about-hero">
<p className="section-tag">ABOUT US</p>
<h1>About FinBank</h1>
<p className="hero-text">
We are committed to providing secure, smart, and seamless banking
solutions for individuals and businesses worldwide.
</p>
</div>

{/* Story Section */}
<div className="about-story">
<div className="story-left">
<h2>Our Story</h2>
<p>
FinBank was built with one mission — to simplify banking for
everyone. We combine modern technology with trusted financial
services to help customers manage money better, faster, and safer.
</p>
<p>
From savings accounts to smart investments, our platform helps
users stay in control of their financial future with confidence.
</p>
</div>

<div className="story-right">
<img
src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
alt="Team member"
/>
</div>
</div>

{/* Mission Vision */}
<div className="mission-vision">
<div className="box">
<h3>Our Mission</h3>
<p>
To make banking simple, accessible, and secure for everyone through
innovation and trust.
</p>
</div>

<div className="box">
<h3>Our Vision</h3>
<p>
To become the most customer-focused digital banking platform in the
world.
</p>
</div>
</div>

{/* Leadership Section */}
<div className="leadership">
<h2>Our Leadership</h2>

<div className="leaders-grid">
<div className="leader-card">
<img
src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
alt="CEO"
/>
<h3>Michael Johnson</h3>
<p>Chief Executive Officer</p>
</div>

<div className="leader-card">
<img
src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
alt="CTO"
/>
<h3>Sarah Williams</h3>
<p>Chief Technology Officer</p>
</div>

<div className="leader-card">
<img
src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
alt="CFO"
/>
<h3>David Brown</h3>
<p>Chief Financial Officer</p>
</div>

<div className="leader-card">
<img
src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
alt="COO"
/>
<h3>Emily Davis</h3>
<p>Chief Operations Officer</p>
</div>
</div>
</div>
</section>
  )
}

export default About
