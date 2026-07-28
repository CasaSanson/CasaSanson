"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const NAV = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Diario", href: "/diario" },
  { label: "Biblioteca", href: "/biblioteca" },
  { label: "Nosotros", href: "/nosotros" },
];

const ACCOUNT = [
  { label: "Mi cuenta", href: "/cuenta" },
  { label: "Iniciar sesión", href: "/cuenta/login" },
  { label: "Registro", href: "/cuenta/registro" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email || sent) return;
    const { error } = await supabase.from("newsletter-emails").insert([{ email }]);
    if (!error) {
      setSent(true);
      setEmail("");
    }
  }

  return (
    <footer className="bg-cs-negro">

      {/* ── Newsletter ── bg-cs-negro (#1c1c1b) → texto blanco */}
      <div className="border-b border-white/10 px-6 md:px-16 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-12">

          <div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-5">
              Newsletter
            </p>
            <h3 className="font-kugile font-light text-3xl md:text-4xl text-white leading-snug">
              Sé el primero<br />en enterarte.
            </h3>
          </div>

          <div className="w-full md:max-w-sm">
            {sent ? (
              <p className="text-[11px] text-cs-gris-ceniza tracking-wider">
                Gracias — ya estás dentro.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="border-b border-white/30 focus-within:border-white/70 transition-colors duration-400">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="tucorreo@gmail.com"
                    className="w-full bg-transparent text-[12px] text-white placeholder:text-cs-gris-ceniza/60 outline-none py-3 tracking-wide"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="self-start text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza hover:text-white transition-colors duration-400 flex items-center gap-3"
                >
                  Suscribirse
                  <span className="inline-block w-6 h-px bg-current" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Links + Marca ── */}
      <div className="px-6 md:px-16 pt-20 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14 mb-20">

          {/* Marca */}
          <div className="md:col-span-2">
            <Image
              src="/sanson_white.png"
              alt="Casa Sansón"
              width={120}
              height={34}
              className="object-contain opacity-80 mb-5"
            />
            <p className="text-[11px] text-cs-gris-ceniza leading-relaxed max-w-xs mb-6">
              La búsqueda de belleza y armonía a través de la forma y la materia.
            </p>
            <a
              href="https://www.instagram.com/casasanson_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza hover:text-white transition-colors duration-400"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              @casasanson_
            </a>
          </div>

          {/* Explorar */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza/60 mb-6">
              Explorar
            </p>
            <ul className="flex flex-col gap-4">
              {NAV.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-cs-gris-ceniza hover:text-white transition-colors duration-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza/60 mb-6">
              Cuenta
            </p>
            <ul className="flex flex-col gap-4">
              {ACCOUNT.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-cs-gris-ceniza hover:text-white transition-colors duration-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[9px] text-cs-gris-ceniza/60 tracking-widest">
            © 2025 Casa Sansón. Todos los derechos reservados.
          </p>
          <p className="text-[9px] text-cs-gris-ceniza/60 tracking-widest">
            Primavera · Verano 26·27 — México
          </p>
        </div>
      </div>

    </footer>
  );
}
