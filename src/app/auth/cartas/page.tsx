"use client"
import { PlusCircle, Edit3, Trash2, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    href: "/auth/cartas/crear",
    label: "Crear entrada",
    description: "Publica nuevas cartas con 6 bloques de contenido multimedia",
    icon: PlusCircle,
    color: "#6f7b6a",
  },
  {
    href: "/auth/cartas/lista",
    label: "Modificar diario",
    description: "Ajusta textos, cambia imágenes o actualiza la fecha de tus cartas",
    icon: Edit3,
    color: "#cfaeb4",
  },
  {
    href: "/auth/cartas/lista",
    label: "Gestionar registros",
    description: "Elimina entradas antiguas. Avisa al equipo antes de borrar",
    icon: Trash2,
    color: "#9b7b7b",
  },
]

export default function AdminCartas() {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={13} strokeWidth={1.5} className="text-white/30" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">Editorial</p>
          </div>
          <h1 className="font-serif text-xl text-white/85">Cartas Sansón</h1>
          <p className="text-[11px] text-white/30 mt-1.5 leading-relaxed max-w-lg">
            Centro de control editorial. Gestiona el contenido del diario asegurando que cada historia mantenga la esencia de Casa Sansón.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {actions.map(({ href, label, description, icon: Icon, color }) => (
            <Link
              key={`${href}-${label}`}
              href={href}
              className="group flex items-center gap-4 p-5 bg-white/[0.025] border border-white/[0.055] hover:bg-white/[0.045] hover:border-white/[0.1] transition-all duration-200"
            >
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}
              >
                <Icon size={15} strokeWidth={1.5} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/75 font-medium">
                  {label}
                </p>
                <p className="text-[10px] text-white/28 mt-0.5">
                  {description}
                </p>
              </div>
              <ArrowRight
                size={12}
                strokeWidth={1.5}
                className="text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 flex items-center gap-2 py-3 px-4 border border-white/[0.05] bg-white/[0.015]">
          <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">
            Conexión activa con Supabase · Las entradas eliminadas no se pueden recuperar
          </p>
        </div>

      </div>
    </div>
  )
}
