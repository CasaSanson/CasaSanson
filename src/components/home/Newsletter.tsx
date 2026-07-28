"use client";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        y: 28,
        opacity: 0,
        duration: 1.3,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
    },
    { scope: sectionRef }
  );

  async function handleSubmit() {
    if (!email.trim() || status === "sent") return;
    setStatus("idle");
    const { error } = await supabase
      .from("newsletter-emails")
      .insert([{ email: email.trim() }]);
    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
      setEmail("");
    }
  }

  return (
    /*
      Fondo: bg-cs-ivory (#F3F0E9)
      Contrastes verificados:
        cs-negro     (#1c1c1b) sobre ivory → ~13.5:1  ✓ AAA
        cs-gris-grafito (#5F5F5E) sobre ivory → ~5.5:1  ✓ AA
        cs-vino      (#5a2a2a) sobre ivory → ~7.2:1  ✓ AAA
    */
    <section ref={sectionRef} className="bg-cs-ivory border-t border-cs-crema-mineral">
      <div
        ref={contentRef}
        className="max-w-7xl mx-auto px-6 md:px-16 py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-16"
      >
        {/* Texto izquierdo */}
        <div className="flex-1">
          <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-grafito mb-6">
            Newsletter
          </p>
          {status === "sent" ? (
            <>
              <h3 className="font-kugile font-light text-4xl md:text-5xl text-cs-negro leading-tight mb-4">
                Estás dentro.
              </h3>
              <p className="text-[11px] text-cs-gris-grafito tracking-wide leading-relaxed">
                Gracias por suscribirte a Casa Sansón.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-kugile font-light text-4xl md:text-5xl text-cs-negro leading-tight">
                Sé el primero<br />en enterarte.
              </h3>
              <p className="text-[11px] text-cs-gris-grafito tracking-wide leading-relaxed mt-5 max-w-xs">
                Novedades, lanzamientos y momentos exclusivos de Casa Sansón.
              </p>
            </>
          )}

          {/* Instagram */}
          <a
            href="https://www.instagram.com/casasanson_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 text-[8px] uppercase tracking-[0.45em] text-cs-gris-grafito hover:text-cs-negro transition-colors duration-400"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            @casasanson_
          </a>
        </div>

        {/* Formulario derecho */}
        {status !== "sent" && (
          <div className="flex-1 md:max-w-sm w-full">
            {/* Input */}
            <div className="border-b border-cs-negro/30 focus-within:border-cs-negro transition-colors duration-500 mb-7">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="tucorreo@gmail.com"
                className="w-full bg-transparent text-[12px] text-cs-negro placeholder:text-cs-gris-grafito/55 outline-none py-3 tracking-wide"
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <p className="text-[9px] text-cs-vino tracking-wider mb-5">
                Algo salió mal. Intenta de nuevo.
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="text-[8px] uppercase tracking-[0.45em] text-cs-negro hover:text-cs-vino transition-colors duration-400 flex items-center gap-3"
            >
              Suscribirse
              <span className="inline-block w-8 h-px bg-current" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
