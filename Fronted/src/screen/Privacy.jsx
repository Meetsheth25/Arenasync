import React from "react";
import "../static/Privacy.css";

export default function Privacy() {
  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="privacy-content">
        <section>
          <h2>Information We Collect</h2>
          <p>We collect personal information including name, email, phone number, and profile information when you register for an account.</p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To process tournament registrations</li>
            <li>To send notifications and updates</li>
            <li>To improve our services</li>
            <li>To communicate with you about events</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. Your password is encrypted and never stored in plain text.</p>
        </section>

        <section>
          <h2>Third-Party Sharing</h2>
          <p>We do not sell your personal information. Data is only shared with tournament organizers for participation purposes.</p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You can access, update, or delete your account information at any time through your profile settings.</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>We use cookies to enhance your browsing experience and maintain login sessions.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>For privacy concerns, email us at privacy@arenasync.com</p>
        </section>
      </div>
    </div>
  );
}