"use client";
import Link from "next/link";

export default function Tape() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">

        {/* Label de sección */}
        <p className="text-[8px] uppercase tracking-[0.4em] text-cs-gris-ceniza mb-14">
          Explorar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">

          {/* Historia */}
          <div className="flex flex-col gap-6 group">
            <Link href="/nosotros" className="block overflow-hidden">
              <img
                src="/pin_about.png"
                alt="Historia"
                className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-90"
              />
            </Link>
            <div>
              <p className="text-[7px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-2">
                Nuestra historia
              </p>
              <Link
                href="/nosotros"
                className="text-[9px] uppercase tracking-[0.35em] text-cs-negro hover:text-cs-vino transition-colors duration-400 inline-flex items-center gap-2"
              >
                Historia
                <span className="inline-block w-5 h-px bg-current transition-all duration-500 group-hover:w-8" />
              </Link>
            </div>
          </div>

          {/* Noticias */}
          <div className="flex flex-col gap-6 group">
            <Link href="/diario" className="block overflow-hidden">
              <img
                src="/pin_journal.png"
                alt="Diario"
                className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-90"
              />
            </Link>
            <div>
              <p className="text-[7px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-2">
                El diario
              </p>
              <Link
                href="/diario"
                className="text-[9px] uppercase tracking-[0.35em] text-cs-negro hover:text-cs-vino transition-colors duration-400 inline-flex items-center gap-2"
              >
                Noticias
                <span className="inline-block w-5 h-px bg-current transition-all duration-500 group-hover:w-8" />
              </Link>
            </div>
          </div>

          {/* Procesos */}
          <div className="flex flex-col gap-6 group">
            <Link href="/biblioteca" className="block overflow-hidden">
              <img
                src="/pin_library.png"
                alt="Biblioteca"
                className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-90"
              />
            </Link>
            <div>
              <p className="text-[7px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-2">
                Biblioteca
              </p>
              <Link
                href="/biblioteca"
                className="text-[9px] uppercase tracking-[0.35em] text-cs-negro hover:text-cs-vino transition-colors duration-400 inline-flex items-center gap-2"
              >
                Procesos
                <span className="inline-block w-5 h-px bg-current transition-all duration-500 group-hover:w-8" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
