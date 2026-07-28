"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.06, ease: "none" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        gsap.to(ring, { scale: 2, duration: 0.35, ease: "power2.out" });
        gsap.to(dot, { scale: 0.4, duration: 0.3 });
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      {/* Dot — sigue instantáneo */}
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 w-[5px] h-[5px] rounded-full bg-white mix-blend-difference z-[99999] pointer-events-none"
      />
      {/* Anillo — sigue con lag */}
      <div
        ref={ringRef}
        className="hidden md:block fixed top-0 left-0 w-7 h-7 rounded-full border border-white mix-blend-difference z-[99999] pointer-events-none"
      />
    </>
  );
}
