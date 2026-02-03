"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Save, Plus, X, Image as ImageIcon, Type, Layout, Calendar } from "lucide-react"
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
        const loadToast = toast.loading("Publicando en el Diario...")

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

            toast.update(loadToast, { render: "¡Entrada publicada con éxito!", type: "success", isLoading: false, autoClose: 3000 })
            // Opcional: Resetear estados aquí
        } catch (error: any) {
            toast.update(loadToast, { render: `Error: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 lg:p-12 text-slate-900 font-sans">
            <ToastContainer position="top-right" theme="dark" />
            
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-end border-b pb-8 border-slate-200">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter italic">CASA SANSÓN <span className="text-blue-600 underline decoration-4">DIARIO</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Portal de Contenido Editorial</p>
                    </div>
                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-2">
                        <Layout size={18}/>
                        <span className="text-[10px] font-black uppercase tracking-widest">Editor de Entradas</span>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* SECCIÓN 1: CABECERA */}
                    <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                        <div className="flex items-center gap-3 text-blue-600 mb-4">
                            <span className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-black">1</span>
                            <h2 className="text-xl font-black uppercase tracking-tight italic">Cabecera de la Entrada</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título de la Carta</label>
                                    <input name="titulo" onChange={handleInputChange} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500 font-bold text-xl" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fecha / Subtítulo General</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                                        <input name="fecha" onChange={handleInputChange} className="w-full mt-2 p-5 pl-12 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500 font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descripción de Portada</label>
                                    <textarea name="descripcion_titulo" onChange={handleInputChange} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500 h-24 resize-none" />
                                </div>
                            </div>

                            <div className="relative group h-full">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Imagen de Portada (Bucket: carta cover)</label>
                                <div className="mt-2 h-[calc(100%-1.5rem)] min-h-[250px] bg-slate-100 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:border-blue-400">
                                    {files.imagen_titulo ? (
                                        <img src={URL.createObjectURL(files.imagen_titulo)} className="w-full h-full object-cover" />
                                    ) : <ImageIcon size={48} className="text-slate-300"/>}
                                    <input type="file" name="imagen_titulo" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 2: BLOQUES DE CONTENIDO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-green-600 mb-8 px-4">
                            <span className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center font-black">2</span>
                            <h2 className="text-xl font-black uppercase tracking-tight italic">Cuerpo de la Carta (6 Bloques)</h2>
                        </div>

                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <section key={num} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:border-green-200 transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black uppercase bg-green-50 text-green-700 px-4 py-2 rounded-full tracking-widest italic">Bloque de Contenido {num}</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Subida de Foto */}
                                    <div className="lg:col-span-4 space-y-4">
                                        <div className="relative h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden hover:bg-white transition-all">
                                            {files[`img${num}`] ? (
                                                <img src={URL.createObjectURL(files[`img${num}`] as File)} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center opacity-30"><Plus size={24} className="mx-auto mb-1"/><p className="text-[9px] font-black uppercase">Foto {num}</p></div>
                                            )}
                                            <input type="file" name={`img${num}`} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        </div>
                                        <input 
                                            name={`subtxt${num}`} 
                                            placeholder={`Subtítulo de foto ${num}`} 
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-1 ring-green-500 italic text-sm font-medium" 
                                        />
                                    </div>

                                    {/* Texto del Bloque */}
                                    <div className="lg:col-span-8">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Cuerpo del texto {num}</label>
                                        <textarea 
                                            name={`texto${num}`} 
                                            onChange={handleInputChange} 
                                            placeholder="Escribe el contenido de esta sección..." 
                                            className="w-full mt-2 p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-green-500 h-[calc(100%-1.5rem)] min-h-[200px] text-lg leading-relaxed" 
                                        />
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* FOOTER ACCIÓN */}
                    <div className="pt-8 pb-20">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xl tracking-[0.2em] uppercase shadow-2xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:bg-slate-400"
                        >
                            {loading ? "Sincronizando con Supabase..." : <><Save size={24}/> Publicar Diario</>}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}