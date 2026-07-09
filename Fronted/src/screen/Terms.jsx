import React from "react";
import "../static/Terms.css";

export default function Terms() {
  return (
    <div className="terms-page">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="terms-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using ArenaSync, you agree to be bound by these Terms & Conditions. If you disagree with any part, please do not use our service.</p>
        </section>

        <section>
          <h2>2. User Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and all activities that occur under your account.</p>
        </section>

        <section>
          <h2>3. Tournament Participation</h2>
          <p>All tournament rules must be followed. Any violation may result in disqualification or account suspension. Tournament organizers have the final say in all decisions.</p>
        </section>

        <section>
          <h2>4. Payments & Refunds</h2>
          <p>Registration fees are non-refundable unless a tournament is canceled by the organizer. Refund requests are handled on a case-by-case basis.</p>
        </section>

        <section>
          <h2>5. Code of Conduct</h2>
          <p>Users must maintain respectful behavior. Harassment, cheating, or unsportsmanlike conduct is prohibited. We reserve the right to remove any user violating these terms.</p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>All content on ArenaSync is protected by copyright. You may not copy, distribute, or create derivative works without permission.</p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>ArenaSync is not responsible for any damages arising from the use of our service. We provide the platform "as is" without warranties.</p>
        </section>

        <section>
          <h2>8. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of the modified terms.</p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>For questions about these terms, contact us at legal@arenasync.com</p>
        </section>
      </div>
    </div>
  );
}