"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const MANIFESTO = [
  "I. CREEMOS EN LA BELLEZA IMPERFECTA DEL MOVIMIENTO",
  "II. HONRAMOS LA SASTRERÍA DESDE LA ARTESANÍA, NO DESDE LA NORMA",
  "III. DISEÑAMOS PARA TODOS LOS CUERPOS QUE BUSCAN CONGRUENCIA, NO ETIQUETAS",
  "IV. LA ROPA DEBE ACOMPAÑAR EL RITMO DE LA VIDA, NO IMPONERLA",
  "V. LA CALIDAD NO ES UN LUJO: ES UNA FORMA DE RESPETO",
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
    }
  }, []);

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as HTMLParagraphElement[];
    if (isOpen) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        lines,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, duration: 0.65, ease: "power2.out", delay: 0.2 }
      );
    } else {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        src="/lore_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradiente sutil en la parte baja para el botón */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Overlay del manifiesto — siempre en el DOM, GSAP controla visibilidad */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col items-center justify-center bg-cs-obsidian/82 z-10 px-8"
        onClick={() => setIsOpen(false)}
      >
        <p className="text-[8px] uppercase tracking-[0.6em] text-cs-gris-ceniza/40 mb-14 select-none">
          Manifiesto
        </p>
        <div
          className="flex flex-col items-center gap-5 max-w-lg text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {MANIFESTO.map((line, i) => (
            <p
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="text-cs-white/75 text-[11px] md:text-xs font-light tracking-[0.18em] leading-relaxed uppercase"
            >
              {line}
            </p>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-16 text-[8px] uppercase tracking-[0.5em] text-cs-gris-ceniza/40 hover:text-cs-gris-ceniza transition-colors duration-500"
        >
          Cerrar
        </button>
      </div>

      {/* Botón trigger — minimal, lujo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group absolute left-1/2 -translate-x-1/2 bottom-10 z-20 flex flex-col items-center gap-3"
      >
        <span className="w-px h-8 bg-white/25 group-hover:bg-white/55 transition-colors duration-700" />
        <span className="text-[8px] uppercase tracking-[0.55em] text-white/45 group-hover:text-white/70 transition-colors duration-700">
          Manifiesto
        </span>
      </button>
    </section>
  );
}
