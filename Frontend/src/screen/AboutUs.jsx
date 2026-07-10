import React from "react";
import "../static/AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About ArenaSync</h1>
        <p>Revolutionizing Sports Tournament Management</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>To provide a seamless platform for organizing, managing, and participating in sports tournaments, making competitive sports accessible to everyone, everywhere.</p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Tournament Management</h3>
              <p>Create and manage tournaments with ease</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Team Registration</h3>
              <p>Easy team registration and player management</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚽</div>
              <h3>Match Scheduling</h3>
              <p>Automated match scheduling and updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Analytics</h3>
              <p>Real-time statistics and insights</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>To become the go-to platform for sports enthusiasts, organizers, and players worldwide, fostering a community of fair play and competitive excellence.</p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <p>With intuitive design, real-time updates, and comprehensive features, ArenaSync makes tournament management effortless. Join thousands of satisfied users who trust us for their sports events.</p>
        </section>
      </div>
    </div>
  );
}