import React, { useState } from "react";
import "../static/FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create a team?",
      answer: "Go to 'My Teams' → 'Create Team'. Fill in your team name, select a tournament and sport, then submit. You'll become the team captain."
    },
    {
      question: "How do I register for a tournament?",
      answer: "Browse tournaments, click on 'Register Team', either use an existing team or create a new one, then submit your registration."
    },
    {
      question: "How long does registration approval take?",
      answer: "Registration approval typically takes 24-48 hours. You'll receive a notification once approved."
    },
    {
      question: "Can I join multiple teams?",
      answer: "Yes, you can join multiple teams across different tournaments, but you cannot join multiple teams in the same tournament."
    },
    {
      question: "How do I invite players to my team?",
      answer: "Share your team ID with players. They can search for your team and request to join. As captain, you can approve or reject requests."
    },
    {
      question: "What happens if I forget my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions to reset your password."
    },
    {
      question: "How do I contact support?",
      answer: "Visit the Contact page or email us at support@arenasync.com"
    },
    {
      question: "Is there a fee to participate?",
      answer: "Fees vary by tournament. Check individual tournament details for registration fees."
    },
    {
      question: "Can I edit my team after creation?",
      answer: "Yes, team captains can edit team details and manage player requests from the My Teams dashboard."
    },
    {
      question: "How are matches scheduled?",
      answer: "Matches are scheduled by tournament organizers. You'll receive notifications when your team's matches are scheduled."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about ArenaSync</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span className="faq-icon">{openIndex === index ? "−" : "+"}</span>
              <h3>{faq.question}</h3>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}