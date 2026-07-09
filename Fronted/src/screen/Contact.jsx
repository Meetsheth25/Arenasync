import '../static/contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      {/* TITLE */}
      <h2 className="contact-title">Contact</h2>
      <div className="contact-underline"></div>
      <p className="contact-subtitle">
        Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
        consectetur velit
      </p>

      {/* INFO BOXES */}
      <div className="contact-info">
        <div className="info-box large">
          <div className="icon-circle">📍</div>
          <h4>Address</h4>
          <p>A108 Adam Street, New York, NY 535022</p>
        </div>

        <div className="info-box">
          <div className="icon-circle">📞</div>
          <h4>Call Us</h4>
          <p>+1 5589 55488 55</p>
        </div>

        <div className="info-box">
          <div className="icon-circle">✉️</div>
          <h4>Email Us</h4>
          <p>info@example.com</p>
        </div>
      </div>

      {/* MAP + FORM */}
      <div className="contact-bottom">
        {/* MAP */}
        <div className="map-box">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=Downtown%20Conference%20Center%20New%20York&output=embed"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* FORM */}
        <form className="contact-form">
          <div className="row">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
          </div>

          <input type="text" placeholder="Subject" />
          <textarea placeholder="Message"></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;