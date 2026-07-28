"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { Calendar, Save, ArrowLeft, ImageIcon, Plus, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AuthEditarCarta() {
  const router = useRouter()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [files, setFiles] = useState<{ [key: string]: File | null }>({})

  useEffect(() => {
    const fetchCarta = async () => {
      if (!id) return
      const { data, error } = await supabase.from("entradas").select("*").eq("id", id).single()
      if (error) {
        toast.error("Error al cargar la entrada")
      } else {
        setFormData(data)
      }
      setLoading(false)
    }
    fetchCarta()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] })
    }
  }

  const uploadToBucket = async (file: File, bucketName: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const loadToast = toast.loading("Actualizando entrada...")

    try {
      const updatedUrls: { [key: string]: string } = {}
      for (const key in files) {
        if (files[key]) {
          const targetBucket = key === 'imagen_titulo' ? 'carta cover' : 'carta_img'
          updatedUrls[key] = await uploadToBucket(files[key]!, targetBucket)
        }
      }

      const { error } = await supabase.from("entradas").update({ ...formData, ...updatedUrls }).eq("id", id)
      if (error) throw error

      toast.update(loadToast, { render: "Entrada actualizada", type: "success", isLoading: false, autoClose: 3000 })
      router.push("/auth/cartas")
    } catch (error: any) {
      toast.update(loadToast, { render: `Error: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 })
    } finally {
      setUpdating(false)
    }
  }

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
              <h1 className="font-serif text-xl text-white/85">Editar entrada</h1>
            </div>
          </div>
          <p className="text-[9px] font-mono text-white/15 hidden md:block">{id}</p>
        </div>

        {/* Step tabs */}
        <div className="flex border border-white/[0.06] overflow-hidden mb-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 py-3 text-[10px] uppercase tracking-[0.25em] transition-all border-b-2 ${
              step === 1 ? "border-cs-verde-musgo text-white/80 bg-white/[0.03]" : "border-transparent text-white/25 hover:text-white/50"
            }`}
          >
            01 · Configuración
          </button>
          <div className="w-px bg-white/[0.06]" />
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex-1 py-3 text-[10px] uppercase tracking-[0.25em] transition-all border-b-2 ${
              step === 2 ? "border-cs-verde-musgo text-white/80 bg-white/[0.03]" : "border-transparent text-white/25 hover:text-white/50"
            }`}
          >
            02 · Cuerpo
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {step === 1 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Título</label>
                    <input
                      name="titulo"
                      value={formData.titulo || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5 mb-1.5">
                      <Calendar size={9} strokeWidth={1.5} /> Fecha
                    </label>
                    <input
                      name="fecha"
                      value={formData.fecha || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Bajada / Descripción</label>
                    <textarea
                      name="descripcion_titulo"
                      value={formData.descripcion_titulo || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/70 outline-none focus:border-cs-verde-musgo/50 transition-colors resize-none h-24"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">Portada</label>
                  <div className="relative h-[210px] bg-white/[0.03] border border-dashed border-white/[0.1] hover:border-white/[0.2] transition-colors flex items-center justify-center overflow-hidden">
                    {(files.imagen_titulo || formData.imagen_titulo) ? (
                      <img
                        src={files.imagen_titulo ? URL.createObjectURL(files.imagen_titulo) : formData.imagen_titulo}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={18} strokeWidth={1} className="mx-auto mb-2 text-white/20" />
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">Cambiar imagen</p>
                      </div>
                    )}
                    <input type="file" name="imagen_titulo" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="bg-white/[0.02] border border-white/[0.05] p-5 hover:border-white/[0.08] transition-colors"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">Bloque {num}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-5">
                    <div className="space-y-2">
                      <div className="relative h-36 bg-white/[0.03] border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors flex items-center justify-center overflow-hidden">
                        {(files[`img${num}`] || formData[`img${num}`]) ? (
                          <img
                            src={files[`img${num}`] ? URL.createObjectURL(files[`img${num}`] as File) : formData[`img${num}`]}
                            className="w-full h-full object-cover"
                            alt=""
                          />
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
                        value={formData[`subtxt${num}`] || ""}
                        onChange={handleInputChange}
                        placeholder={`Subtítulo ${num}`}
                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/50 italic outline-none focus:border-cs-verde-musgo/40 transition-colors placeholder:text-white/15"
                      />
                    </div>

                    <div>
                      <label className="text-[8px] uppercase tracking-[0.3em] text-white/20 block mb-1.5">Texto {num}</label>
                      <textarea
                        name={`texto${num}`}
                        value={formData[`texto${num}`] || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-[13px] text-white/70 outline-none focus:border-cs-verde-musgo/40 transition-colors resize-none h-36 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex gap-3 pb-12">
            <button
              type="button"
              onClick={() => setStep(step === 1 ? 2 : 1)}
              className="flex items-center gap-1.5 px-5 py-3 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/60 transition-all"
            >
              {step === 1 ? (<>Cuerpo <ChevronRight size={12} strokeWidth={1.5} /></>) : "← Portada"}
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-cs-verde-musgo/40 disabled:opacity-30 transition-all py-3 text-[10px] uppercase tracking-[0.3em] text-white/70"
            >
              <Save size={12} strokeWidth={1.5} />
              {updating ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
