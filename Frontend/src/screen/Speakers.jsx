import "../static/speakers.css";

const speakers = [
  {
    name: "Rahul Verma",
    role: "Head Cricket Coach",
    desc: "Former national-level coach with 15+ years of experience in training professional athletes.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    name: "Anita Sharma",
    role: "Sports Analyst",
    desc: "Expert in match analysis, performance metrics, and data-driven sports strategies.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    name: "David Miller",
    role: "International Referee",
    desc: "Certified international referee who has officiated over 200 professional matches.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    name: "Karan Singh",
    role: "Fitness & Conditioning Expert",
    desc: "Specialist in athlete fitness, injury prevention, and sports conditioning programs.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
];

const Speakers = () => {
  return (
    <section className="speakers-page">
      {/* HEADER */}
      <div className="speakers-header">
        <h2>Event Speakers</h2>
        <div className="underline"></div>
        <p>
          Meet our expert speakers who bring years of experience from the world
          of professional sports, coaching, fitness, and tournament management.
        </p>
      </div>

      {/* SPEAKERS GRID */}
      <div className="speakers-grid">
        {speakers.map((spk, index) => (
          <div className="speaker-card" key={index}>
            <img src={spk.img} alt={spk.name} />

            <div className="speaker-overlay">
              <h3>{spk.name}</h3>
              <span>{spk.role}</span>
              <p>{spk.desc}</p>

              <div className="socials">
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EXTRA SECTION (UNIQUE) */}
      <div className="speaker-highlight">
        <h3>Why Our Speakers Matter?</h3>
        <p>
          Our speakers are not just presenters — they are professionals who
          actively shape sports tournaments, train athletes, manage events, and
          make real-time decisions on the field. Their insights help players,
          organizers, and coaches understand the modern sports ecosystem.
        </p>
      </div>
    </section>
  );
};

export default Speakers;