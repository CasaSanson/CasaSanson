"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Save, Plus, X, Image as ImageIcon, Calendar } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function AuthCrearCarta() {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<any>({
    titulo: "", fecha: "", descripcion_titulo: "",
    texto1: "", subtxt1: "", texto2: "", subtxt2: "",
    texto3: "", subtxt3: "", texto4: "", subtxt4: "",
    texto5: "", subtxt5: "", texto6: "", subtxt6: ""
  })

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    imagen_titulo: null, img1: null, img2: null, img3: null, img4: null, img5: null, img6: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] })
    }
  }

  const uploadFile = async (file: File, bucketName: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    const { error } = await supabase.storage.from(bucketName).upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const loadToast = toast.loading("Publicando entrada...")

    try {
      const imageUrls: any = {}
      for (const key in files) {
        const file = files[key]
        if (file) {
          const bucket = key === 'imagen_titulo' ? 'carta cover' : 'carta_img'
          imageUrls[key] = await uploadFile(file, bucket)
        }
      }

      const { error } = await supabase.from("entradas").insert([{ ...formData, ...imageUrls }])
      if (error) throw error

      toast.update(loadToast, { render: "Entrada publicada", type: "success", isLoading: false, autoClose: 3000 })
    } catch (error: any) {
      toast.update(loadToast, { render: `Error: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <ToastContainer position="top-right" theme="dark" />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.06]">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-0.5">Editorial</p>
          <h1 className="font-serif text-xl text-white/85">Nueva entrada</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Header */}
          <div className="bg-white/[0.02] border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[9px] bg-cs-verde-musgo/15 border border-cs-verde-musgo/25 text-cs-verde-musgo px-2 py-0.5 uppercase tracking-[0.2em]">
                01
              </span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Cabecera</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Título</label>
                  <input
                    name="titulo"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/15"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5 mb-1.5">
                    <Calendar size={9} strokeWidth={1.5} /> Fecha
                  </label>
                  <input
                    name="fecha"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Descripción de portada</label>
                  <textarea
                    name="descripcion_titulo"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/70 outline-none focus:border-cs-verde-musgo/50 transition-colors resize-none h-20 placeholder:text-white/15"
                  />
                </div>
              </div>

              {/* Cover image */}
              <div>
                <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Imagen de portada</label>
                <div className="relative h-[200px] bg-white/[0.03] border border-dashed border-white/[0.1] hover:border-white/[0.2] transition-colors flex items-center justify-center overflow-hidden">
                  {files.imagen_titulo ? (
                    <img src={URL.createObjectURL(files.imagen_titulo)} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={18} strokeWidth={1} className="mx-auto mb-2 text-white/20" />
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">Subir portada</p>
                    </div>
                  )}
                  <input type="file" name="imagen_titulo" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Sections 2-7: Content blocks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] bg-white/[0.05] border border-white/[0.08] text-white/30 px-2 py-0.5 uppercase tracking-[0.2em]">
                02
              </span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">Cuerpo de la carta · 6 bloques</p>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="bg-white/[0.02] border border-white/[0.05] p-5 hover:border-white/[0.08] transition-colors"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">Bloque {num}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-5">
                    {/* Image + subtitle */}
                    <div className="space-y-2">
                      <div className="relative h-36 bg-white/[0.03] border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors flex items-center justify-center overflow-hidden">
                        {files[`img${num}`] ? (
                          <img src={URL.createObjectURL(files[`img${num}`] as File)} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="text-center">
                            <Plus size={14} strokeWidth={1} className="mx-auto mb-1 text-white/15" />
                            <p className="text-[8px] uppercase tracking-wider text-white/15">Foto {num}</p>
                          </div>
                        )}
                        <input type="file" name={`img${num}`} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                      <input
                        name={`subtxt${num}`}
                        placeholder={`Subtítulo ${num}`}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/50 italic outline-none focus:border-cs-verde-musgo/40 transition-colors placeholder:text-white/15"
                      />
                    </div>

                    {/* Text block */}
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.3em] text-white/20 block mb-1.5">Texto {num}</label>
                      <textarea
                        name={`texto${num}`}
                        onChange={handleInputChange}
                        placeholder="Escribe el contenido de esta sección..."
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-[13px] text-white/70 outline-none focus:border-cs-verde-musgo/40 transition-colors resize-none h-36 leading-relaxed placeholder:text-white/15"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pb-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-cs-verde-musgo/40 disabled:opacity-30 transition-all py-4 text-[10px] uppercase tracking-[0.35em] text-white/70"
            >
              <Save size={12} strokeWidth={1.5} />
              {loading ? "Publicando..." : "Publicar entrada"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
