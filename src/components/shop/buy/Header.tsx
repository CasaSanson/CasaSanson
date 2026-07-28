"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <div className="mb-14">
            <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-cs-gris-ceniza hover:text-cs-negro transition-colors duration-400 mb-10"
            >
                <span className="inline-block w-4 h-px bg-current" />
                Catálogo
            </Link>
            <div className="flex flex-col items-center gap-3">
                <Image
                    src="/sanson_black.png"
                    alt="Casa Sansón"
                    width={110}
                    height={30}
                    className="object-contain opacity-90"
                />
                <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza/70">
                    Pago seguro · Envío certificado
                </p>
            </div>
        </div>
    );
}
