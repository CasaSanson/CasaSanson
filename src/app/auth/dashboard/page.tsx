"use client";
import { useSession } from "next-auth/react";
import { equipo } from "@/lib/equipo";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  FileText,
  BookOpen,
  Users,
  ArrowRight,
  Wallet,
} from "lucide-react";

const sections = [
  {
    href: "/auth/dashboard/pedidos",
    label: "Pedidos",
    description: "Revisa y gestiona los pedidos recientes",
    icon: ShoppingBag,
    color: "#6f7b6a",
  },
  {
    href: "/auth/productos",
    label: "Productos",
    description: "Administra el catálogo de piezas",
    icon: Package,
    color: "#cfaeb4",
  },
  {
    href: "/auth/finanzas",
    label: "Finanzas",
    description: "Balance, gastos, ingresos y KPIs",
    icon: Wallet,
    color: "#b5a8c5",
  },
  {
    href: "/auth/cartas",
    label: "Cartas",
    description: "Gestiona las cartas del blog",
    icon: FileText,
    color: "#9b7b7b",
  },
  {
    href: "/auth/libros",
    label: "Libros",
    description: "Sube y administra los libros",
    icon: BookOpen,
    color: "#6b8a9b",
  },
];

export default function Dashboard() {
  const { data: session } = useSession();

  const dateStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-white/[0.06]">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-2.5 capitalize">
            {dateStr}
          </p>
          <h1 className="font-serif text-[22px] text-white/90 tracking-wide">
            Bienvenido, {firstName}
          </h1>
          <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
            Casa Sansón &middot; Portal de Administración
          </p>
        </div>

        {/* Sections grid */}
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4">
            Secciones
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sections.map(({ href, label, description, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 p-5 bg-white/[0.025] border border-white/[0.055] hover:bg-white/[0.045] hover:border-white/[0.1] transition-all duration-200"
              >
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded"
                  style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}
                >
                  <Icon size={15} strokeWidth={1.5} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/75 font-medium">
                    {label}
                  </p>
                  <p className="text-[10px] text-white/28 mt-0.5 truncate">
                    {description}
                  </p>
                </div>
                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="text-white/15 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.05] mb-8" />

        {/* Team */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
            <Users size={10} strokeWidth={1.5} />
            Equipo
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {equipo.map((member) => {
              const initials = `${member.nombre[0]}${member.apellido[0]}`;
              return (
                <div
                  key={member.id}
                  className="p-4 bg-white/[0.02] border border-white/[0.05] flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-cs-verde-musgo/10 border border-cs-verde-musgo/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-cs-verde-musgo uppercase">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/65 truncate">
                      {member.nombre} {member.apellido}
                    </p>
                    <p className="text-[9px] text-white/25 truncate mt-0.5">
                      {member.mail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
