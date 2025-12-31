import React from "react";

export default function Flipbook() {
  return (
    <div
     className="block"
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "46.25%", // relación 16:9 (puedes ajustar)
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <iframe
        src="https://heyzine.com/flip-book/6a52c8269a.html"
        title="heyzine-flipbook"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
}