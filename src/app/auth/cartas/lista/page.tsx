"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft, Loader2, Search, BookOpen, Plus } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function ListaGestionCartas() {
  const [cartas, setCartas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCartas = async () => {
    try {
      const { data, error } = await supabase
        .from("entradas")
        .select("id, titulo, fecha, imagen_titulo")
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setCartas(data)
    } catch (error: any) {
      toast.error("Error al sincronizar el Diario")
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCartas() }, [])

  const eliminarCarta = async (id: string, titulo: string) => {
    const confirmar = confirm(`¿Eliminar "${titulo}"?\nEsta acción eliminará todos los bloques de texto y fotos.`)
    if (!confirmar) return

    setDeletingId(id)
    const { error } = await supabase.from("entradas").delete().eq("id", id)
    if (error) {
      toast.error("No se pudo eliminar: " + error.message)
      setDeletingId(null)
    } else {
      setCartas(cartas.filter(c => c.id !== id))
      toast.success("Entrada eliminada")
      setDeletingId(null)
    }
  }

  const filteredCartas = cartas.filter(c =>
    c.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={24} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <ToastContainer position="top-right" theme="dark" />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <Link
              href="/auth/cartas"
              className="w-8 h-8 flex items-center justify-center border border-white/[0.07] hover:border-white/[0.15] text-white/30 hover:text-white/60 transition-all"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-0.5">Editorial</p>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-xl text-white/85">Gestión editorial</h1>
                <span className="text-[9px] bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 text-white/30 uppercase tracking-wider">
                  {cartas.length} entradas
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/auth/cartas/crear"
            className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/60"
          >
            <Plus size={11} strokeWidth={2} />
            Nueva entrada
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.07] text-[12px] text-white/70 placeholder:text-white/20 outline-none focus:border-white/[0.15] transition-colors"
          />
        </div>

        {/* List */}
        {filteredCartas.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/[0.06]">
            <BookOpen size={20} strokeWidth={1} className="mx-auto mb-3 text-white/10" />
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">El diario está vacío</p>
            <Link
              href="/auth/cartas/crear"
              className="inline-block mt-4 text-[10px] text-cs-verde-musgo/60 hover:text-cs-verde-musgo uppercase tracking-[0.2em] transition-colors"
            >
              Publicar primera entrada
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredCartas.map((carta) => (
              <div
                key={carta.id}
                className="flex items-center gap-4 py-4 px-2 hover:bg-white/[0.015] transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-white/[0.04] border border-white/[0.06]">
                  {carta.imagen_titulo && (
                    <img
                      src={carta.imagen_titulo}
                      className="w-full h-full object-cover"
                      alt={carta.titulo}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[13px] text-white/75 truncate">
                    {carta.titulo || "Sin título"}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {carta.fecha && (
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">{carta.fecha}</p>
                    )}
                    <p className="text-[9px] font-mono text-white/15 truncate">
                      {carta.id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/auth/cartas/editar/${carta.id}`}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white/70 border border-transparent hover:border-white/[0.12] px-3 py-2 transition-all"
                  >
                    <Pencil size={11} strokeWidth={1.5} />
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarCarta(carta.id, carta.titulo)}
                    disabled={deletingId === carta.id}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/20 hover:text-cs-vino/80 border border-transparent hover:border-cs-vino/30 px-3 py-2 transition-all disabled:opacity-30"
                  >
                    {deletingId === carta.id ? (
                      <Loader2 className="animate-spin" size={11} />
                    ) : (
                      <Trash2 size={11} strokeWidth={1.5} />
                    )}
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
