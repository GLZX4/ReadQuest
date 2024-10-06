// src/pages/HomePage.js
import React from 'react';
import "../styles/homepage.css";

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className='hero-shadow'>
          <section className='hero-content'>
            <h1 className='hero-tagline'>Enhancing Reading Comprehension Through Gamification</h1>
            <p className='hero-description'>Our platform provides an interactive and engaging way for students to improve their reading skills.</p>
            <button className='cta-button hero-button'>Get Started</button>
          </section>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
