"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BookOpen, Upload, Link as LinkIcon, AlignLeft, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CrearLibro() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ titulo: "", descripcion: "", heyzine_link: "" })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coverFile) return toast.error("Por favor, sube una portada")
    setLoading(true)

    try {
      const fileExt = coverFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('libro_cover').upload(fileName, coverFile)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('libro_cover').getPublicUrl(fileName)

      const { error: insertError } = await supabase.from("libros").insert([{
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        heyzine_link: formData.heyzine_link,
        cover: urlData.publicUrl
      }])
      if (insertError) throw insertError

      toast.success("Libro publicado")
      router.push("/auth/libros/lista")
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <ToastContainer position="top-right" theme="dark" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/[0.06]">
          <Link
            href="/auth/libros"
            className="w-8 h-8 flex items-center justify-center border border-white/[0.07] hover:border-white/[0.15] text-white/30 hover:text-white/60 transition-all"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-0.5">Biblioteca</p>
            <h1 className="font-serif text-xl text-white/85">Nuevo libro</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">

          {/* Cover upload */}
          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
              Portada
            </label>
            <div className="relative h-72 bg-white/[0.03] border border-dashed border-white/[0.1] hover:border-white/[0.2] transition-colors flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center">
                  <Upload size={18} strokeWidth={1} className="mx-auto mb-2 text-white/20" />
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">Seleccionar imagen</p>
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
            </div>
            <p className="text-[9px] text-white/20 mt-1.5 italic">Formato vertical recomendado</p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5 mb-1.5">
                <BookOpen size={10} strokeWidth={1.5} /> Título
              </label>
              <input
                name="titulo"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/15"
                placeholder="Ej: Crónicas de Sansón"
                required
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5 mb-1.5">
                <LinkIcon size={10} strokeWidth={1.5} /> Link de Heyzine
              </label>
              <input
                name="heyzine_link"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-cs-verde-musgo/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/15"
                placeholder="https://heyzine.com/flip-book/..."
              />
            </div>

            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5 mb-1.5">
                <AlignLeft size={10} strokeWidth={1.5} /> Descripción
              </label>
              <textarea
                name="descripcion"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/70 outline-none focus:border-cs-verde-musgo/50 transition-colors resize-none h-32 placeholder:text-white/15"
                placeholder="Breve reseña del libro..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-cs-verde-musgo/40 disabled:opacity-30 transition-all py-3.5 text-[10px] uppercase tracking-[0.3em] text-white/70 mt-auto"
            >
              <Save size={12} strokeWidth={1.5} />
              {loading ? "Publicando..." : "Publicar libro"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
