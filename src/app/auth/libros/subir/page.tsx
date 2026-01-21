"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { BookOpen, Upload, Link as LinkIcon, AlignLeft, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CrearLibro() {
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        heyzine_link: ""
    })
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setCoverFile(file)
            setPreview(URL.createObjectURL(file)) // Previsualización instantánea
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!coverFile) return toast.error("Por favor, sube una portada")
        
        setLoading(true)

        try {
            // 1. Subir Portada a 'libro_cover'
            const fileExt = coverFile.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            
            const { error: uploadError } = await supabase.storage
                .from('libro_cover')
                .upload(fileName, coverFile)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
                .from('libro_cover')
                .getPublicUrl(fileName)

            // 2. Insertar datos en la tabla 'libros'
            const { error: insertError } = await supabase.from("libros").insert([
                {
                    titulo: formData.titulo,
                    descripcion: formData.descripcion,
                    heyzine_link: formData.heyzine_link,
                    cover: urlData.publicUrl
                }
            ])

            if (insertError) throw insertError

            toast.success("¡Libro publicado con éxito!")
            router.push("/auth/libros/lista") // O a tu panel principal

        } catch (error: any) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="p-6 max-w-4xl mx-auto bg-white min-h-screen">
            <div className="flex items-center gap-4 mb-10">
                <Link href="/auth/libros" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Nuevo Libro</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Columna Izquierda: Imagen */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Portada del Libro</label>
                    <div className="relative border-4 border-dashed border-slate-200 rounded-3xl p-4 h-[450px] flex flex-col items-center justify-center hover:border-blue-400 transition-colors bg-slate-50 group overflow-hidden">
                        {preview ? (
                            <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="text-center">
                                <Upload className="mx-auto text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" size={48} />
                                <p className="text-slate-400 font-medium">Click para seleccionar imagen</p>
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
                    <p className="text-xs text-slate-400 text-center italic">Recomendado: Formato vertical (A4 o similar)</p>
                </div>

                {/* Columna Derecha: Datos */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2"><BookOpen size={16}/> Título del Libro</label>
                        <input 
                            name="titulo" 
                            onChange={handleInputChange} 
                            className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg" 
                            placeholder="Ej: Crónicas de Sansón" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2"><LinkIcon size={16}/> Link de Heyzine</label>
                        <input 
                            name="heyzine_link" 
                            onChange={handleInputChange} 
                            className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none text-blue-600" 
                            placeholder="https://heyzine.com/flip-book/..." 
                        />
                    </div>

                    <div className="space-y-2 flex-grow">
                        <label className="text-sm font-bold flex items-center gap-2"><AlignLeft size={16}/> Descripción / Resumen</label>
                        <textarea 
                            name="descripcion" 
                            onChange={handleInputChange} 
                            className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none min-h-[150px]" 
                            placeholder="Escribe una breve reseña del libro..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                    >
                        {loading ? "Subiendo Libro..." : <><Save /> PUBLICAR LIBRO</>}
                    </button>
                </div>
            </form>
        </main>
    )
}