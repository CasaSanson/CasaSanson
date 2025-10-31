import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#071019]">
      {/* 1️⃣ Fondo base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071019] via-[#0b2230] to-[#071019]" />

      {/* 2️⃣ Capa SVG fractal (efecto líquido animado) */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay animate-ripple-bg"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.008%22 numOctaves=%224%22 seed=%2210%22/></filter><rect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22/></svg>')",
          backgroundSize: "1600px 1600px",
        }}
      />

      {/* 3️⃣ Capa de color difuso */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-40 w-[65vw] h-[65vh] bg-gradient-to-r from-[#7c3aed]/20 via-[#ec4899]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-10 right-0 w-[45vw] h-[35vh] bg-gradient-to-l from-[#06b6d4]/12 via-[#7c3aed]/8 to-transparent blur-2xl" />
      </div>

      {/* 4️⃣ Capa de ruido fino */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22/></filter><rect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.15%22/></svg>')",
        }}
      />

      {/* 5️⃣ Líneas animadas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-1/2 bg-white/90 animate-line-down" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3px] h-1/2 bg-white/90 animate-line-up" />

      {/* 6️⃣ Contenido centrado */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-3xl font-semibold mb-2">Datamara</h1>
          <p className="text-slate-300/80">Cargando — preparando el dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
