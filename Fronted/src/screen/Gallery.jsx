import { useEffect, useState } from "react";
import "../static/gallery.css";

const images = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ AUTO SCROLL EVERY 2000ms
  useEffect(() => {
    if (isOpen) return; // pause auto-scroll when modal is open

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval); // cleanup
  }, [isOpen]);

  return (
    <>
      {/* SECTION */}
      <section className="gallery-section">
        <h2 className="gallery-title">Gallery</h2>
        <div className="gallery-underline"></div>
        <p className="gallery-subtitle">
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
        </p>

        {/* IMAGE STRIP */}
        <div className="gallery-strip">
          {images.map((img, index) => (
            <div
              key={index}
              className={`gallery-item ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => {
                setActiveIndex(index);
                setIsOpen(true);
              }}
            >
              <img src={img} alt="gallery" />
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="gallery-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={index === activeIndex ? "dot active" : "dot"}
              onClick={() => setActiveIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* FULLSCREEN MODAL */}
      {isOpen && (
        <div className="gallery-modal">
          <span className="close" onClick={() => setIsOpen(false)}>
            ×
          </span>

          <img src={images[activeIndex]} alt="full" />

          <div className="modal-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={index === activeIndex ? "dot active" : "dot"}
                onClick={() => setActiveIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
