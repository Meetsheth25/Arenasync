import "./venue.css";

export default function Venue() {
  return (
    <>
      {/* NAVBAR */}
     

      {/* TITLE */}
      <section className="venue-title">
        <h1>Event Venue</h1>
        <span></span>
        <p>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
        </p>
      </section>

      {/* MAP + INFO */}
      <section className="venue-main">
        <iframe
          title="map"
          src="https://www.google.com/maps?q=Downtown%20Conference%20Center%20New%20York&output=embed"
        ></iframe>

        <div className="venue-info">
          <div className="overlay"></div>
          <div className="text">
            <h2>Downtown Conference Center, New York</h2>
            <p>
              Iste nobis eum sapiente sunt enim dolores labore accusantium
              autem. Cumque beatae ipsum.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="venue-gallery">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" />
        <img src="https://images.unsplash.com/photo-1503428593586-e225b39bddfe" />
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c" />
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" />
      </section>
    </>
  );
}
