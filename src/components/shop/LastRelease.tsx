"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LastRelease() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(headingRef.current, {
        y: 24,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
      gsap.from([grid1Ref.current, grid2Ref.current], {
        y: 48,
        opacity: 0,
        stagger: 0.15,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="w-full bg-white pt-24 pb-32 px-6 md:px-16">

      {/* Encabezado — estilo Loro Piana: label pequeño + heading enorme */}
      <div ref={headingRef} className="max-w-7xl mx-auto flex items-end justify-between mb-16">
        <div>
          <p className="text-[8px] uppercase tracking-[0.35em] text-cs-gris-ceniza mb-4">
            Primavera · Verano 2026
          </p>
          <h2 className="font-kugile font-light text-5xl md:text-6xl lg:text-[5.5rem] text-cs-negro leading-none">
            La nueva entrega
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="hidden md:block text-[8px] uppercase tracking-[0.35em] text-cs-negro/40 hover:text-cs-negro transition-colors duration-500 pb-2"
        >
          Ver catálogo →
        </Link>
      </div>

      {/* Grid asimétrico 7/5 — como Loro Piana */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:gap-6">

        {/* Imagen principal — 7 columnas */}
        <div ref={grid1Ref} className="col-span-12 md:col-span-7 flex flex-col">
          <Link
            href="/catalogo/ver/3681c764-e474-4083-abb0-560d82051f79"
            className="block overflow-hidden group"
          >
            <div className="relative h-[72vh] overflow-hidden">
              <img
                src="/hoverbeto.jpg"
                alt="Nueva pieza"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
              />
              <img
                src="/beto.jpg"
                alt="Nueva pieza — detalle"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
              />
            </div>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[8px] uppercase tracking-[0.35em] text-cs-gris-ceniza">
              Nueva pieza
            </p>
            <Link
              href="/catalogo/ver/3681c764-e474-4083-abb0-560d82051f79"
              className="text-[8px] uppercase tracking-[0.35em] text-cs-negro/40 hover:text-cs-negro transition-colors duration-400 flex items-center gap-2"
            >
              Ver <span className="inline-block w-5 h-px bg-current" />
            </Link>
          </div>
        </div>

        {/* Imagen secundaria — 5 columnas, offset editorial hacia abajo */}
        <div ref={grid2Ref} className="col-span-12 md:col-span-5 md:pt-32 flex flex-col">
          <Link href="/catalogo" className="block overflow-hidden group">
            <div className="relative h-[72vh] md:h-[56vh] overflow-hidden">
              <img
                src="/catalogo1.png"
                alt="Catálogo"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
              />
              <img
                src="/catalogohover.png"
                alt="Catálogo — detalle"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
              />
            </div>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[8px] uppercase tracking-[0.35em] text-cs-gris-ceniza">
              Catálogo
            </p>
            <Link
              href="/catalogo"
              className="text-[8px] uppercase tracking-[0.35em] text-cs-negro/40 hover:text-cs-negro transition-colors duration-400 flex items-center gap-2"
            >
              Explorar <span className="inline-block w-5 h-px bg-current" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
