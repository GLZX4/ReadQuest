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
            <p className='hero-description'>Our platform provides an interactive and engaging way for students to improve their quick reading comprehension skills.</p>
            <button className='cta-button hero-button'>Get Started</button>
          </section>
        </div>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <span className='features-title'>How we Do it</span>
        <div className='features-container'>
          <div className='feature-column'>
            <span className='feature-title'>Intreractive Reading Tasks</span>
            <span className='feature-description'>Gamified tasks to improve reading comprehension</span>
            <img alt='Game round demonstration' className='featureIMG-demonstration'></img>
          </div>

          <div className='feature-column'>
            <span className='feature-title'>Progress Tracking</span>
            <span className='feature-description'>Badges, Rewards, Progress Charts</span>
            <img alt='Progress demonstration' className='featureIMG-demonstration tutorToolDemo'></img>
          </div>
          
          <div className='feature-column'>
            <span className='feature-title'>Tutor Tools</span>
            <span className='feature-description'>Tutors can track students progress and assign tasks</span>
            <div alt='Tutor Tool Demonstration' className='featureIMG-demonstration '></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
