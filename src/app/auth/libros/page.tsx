"use client"
import { UploadCloudIcon, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    href: "/auth/libros/subir",
    label: "Subir libro",
    description: "Publica un nuevo libro con portada y link de Heyzine",
    icon: UploadCloudIcon,
    color: "#6f7b6a",
  },
  {
    href: "/auth/libros/lista",
    label: "Gestionar libros",
    description: "Visualiza y elimina libros de la biblioteca",
    icon: Trash2,
    color: "#9b7b7b",
  },
]

export default function AdminLibros() {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-10 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={13} strokeWidth={1.5} className="text-white/30" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">Biblioteca</p>
          </div>
          <h1 className="font-serif text-xl text-white/85">Libros</h1>
          <p className="text-[11px] text-white/30 mt-1.5 leading-relaxed max-w-lg">
            Administra los libros de Casa Sansón. Revisa la página principal tras cada cambio y avisa al CTO si se presenta algún error.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map(({ href, label, description, icon: Icon, color }) => (
            <Link
              key={href}
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
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
