"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Trash2, ArrowLeft, Loader2, BookOpen, ExternalLink, Plus } from "lucide-react"

export default function ListaGestionLibros() {
  const [libros, setLibros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchLibros = async () => {
    try {
      const { data, error } = await supabase
        .from("libros")
        .select("*")
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setLibros(data)
    } catch (error: any) {
      console.error("Error al cargar libros:", error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLibros() }, [])

  const eliminarLibro = async (id: number, titulo: string) => {
    const confirmar = confirm(`¿Eliminar "${titulo}"?`)
    if (!confirmar) return

    setDeletingId(id)
    const { error } = await supabase.from("libros").delete().eq("id", id)
    if (error) {
      alert("Error al eliminar: " + error.message)
      setDeletingId(null)
    } else {
      setLibros(libros.filter(l => l.id !== id))
      setDeletingId(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={24} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <Link
              href="/auth/libros"
              className="w-8 h-8 flex items-center justify-center border border-white/[0.07] hover:border-white/[0.15] text-white/30 hover:text-white/60 transition-all"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <BookOpen size={12} strokeWidth={1.5} className="text-white/25" />
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">Biblioteca</p>
              </div>
              <h1 className="font-serif text-xl text-white/85">Gestión de libros</h1>
            </div>
          </div>
          <Link
            href="/auth/libros/subir"
            className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/60"
          >
            <Plus size={11} strokeWidth={2} />
            Nuevo libro
          </Link>
        </div>

        {/* List */}
        {libros.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/[0.06]">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
              No hay libros en la biblioteca
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {libros.map((libro) => (
              <div
                key={libro.id}
                className="flex items-center gap-5 py-4 hover:bg-white/[0.015] transition-colors px-2"
              >
                {/* Cover */}
                <div className="w-12 h-16 flex-shrink-0 overflow-hidden bg-white/[0.04] border border-white/[0.06]">
                  {libro.cover && (
                    <img
                      src={libro.cover}
                      className="w-full h-full object-cover"
                      alt={libro.titulo}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[13px] text-white/80 truncate">{libro.titulo}</p>
                  {libro.descripcion && (
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{libro.descripcion}</p>
                  )}
                  {libro.heyzine_link && (
                    <a
                      href={libro.heyzine_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[9px] text-cs-verde-musgo/70 hover:text-cs-verde-musgo mt-1 transition-colors uppercase tracking-wider"
                    >
                      <ExternalLink size={9} strokeWidth={1.5} />
                      Ver en Heyzine
                    </a>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => eliminarLibro(libro.id, libro.titulo)}
                  disabled={deletingId === libro.id}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/20 hover:text-cs-vino/80 border border-transparent hover:border-cs-vino/30 px-3 py-2 transition-all disabled:opacity-30"
                >
                  {deletingId === libro.id ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : (
                    <Trash2 size={12} strokeWidth={1.5} />
                  )}
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
