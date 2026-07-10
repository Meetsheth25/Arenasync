import React, { useState, useRef } from "react";

export default function TiltCard({ children, className = "", style = {}, maxTilt = 10, scale = 1.02 }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    // Mouse coordinates relative to card bounds
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Standardized coordinates around the card center (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Rotations (note: moving along x sways rotation along Y, and vice versa)
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    // Glass sheen gloss percentage coordinates
    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setCoords({ rotateX, rotateY, glossX, glossY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  };

  const currentTransform = isHovered
    ? `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale(${scale})`
    : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glow-card-3d light-sweep-wrapper border-3d-glow ${className}`}
      style={{
        ...style,
        transform: currentTransform,
        transition: isHovered ? "transform 0.05s ease-out, box-shadow 0.2s ease" : "transform 0.4s ease-out, box-shadow 0.4s ease",
      }}
    >
      {/* Sheen Highlight Overlay */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at ${coords.glossX}% ${coords.glossY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 60%)`,
            pointerEvents: "none",
            zIndex: 3,
            borderRadius: "inherit",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
