"use client";
import React from "react";

const WaterRipple = () => {
  return (
    <div
      className="absolute inset-0 z-0 opacity-40 animate-ripple-bg mix-blend-overlay"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><filter id=%22ripple%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.008%22 numOctaves=%224%22 seed=%2212%22/><feDisplacementMap in=%22SourceGraphic%22 scale=%2212%22/></filter><rect width=%22400%22 height=%22400%22 filter=%22url(%23ripple)%22/></svg>')",
        backgroundSize: "1400px 1400px",
      }}
    ></div>
  );
};

export default WaterRipple;
