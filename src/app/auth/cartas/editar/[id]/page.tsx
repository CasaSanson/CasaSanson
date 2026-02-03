"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { Type, Calendar, Save, ArrowLeft, ImageIcon, Plus, ChevronRight, FileText } from "lucide-react"
import Link from "next/link"

export default function AuthEditarCarta() {
    const router = useRouter()
    const { id } = useParams()
    
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [step, setStep] = useState(1) // 1: Portada, 2: Bloques de Contenido
    const [formData, setFormData] = useState<any>({})
    const [files, setFiles] = useState<{ [key: string]: File | null }>({})

    useEffect(() => {
        const fetchCarta = async () => {
            if (!id) return;
            const { data, error } = await supabase.from("entradas").select("*").eq("id", id).single();
            if (error) {
                toast.error("Error al cargar la entrada");
            } else {
                setFormData(data);
            }
            setLoading(false);
        };
        fetchCarta();
    }, [id]);

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
        const loadToast = toast.loading("Actualizando entrada editorial...");

        try {
            const updatedUrls: { [key: string]: string } = {}
            for (const key in files) {
                if (files[key]) {
                    const targetBucket = key === 'imagen_titulo' ? 'carta cover' : 'carta_img'
                    const url = await uploadToBucket(files[key]!, targetBucket)
                    updatedUrls[key] = url
                }
            }

            const { error } = await supabase.from("entradas").update({ ...formData, ...updatedUrls }).eq("id", id)
            if (error) throw error

            toast.update(loadToast, { render: "¡Entrada actualizada!", type: "success", isLoading: false, autoClose: 3000 });
            router.push("/auth/cartas")
        } catch (error: any) {
            toast.update(loadToast, { render: `Error: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 });
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse">CARGANDO DIARIO...</div>

    return (
        <main className="min-h-screen bg-[#fcfcfc] p-6 lg:p-12 text-slate-900">
            <ToastContainer position="top-right" theme="dark" />
            
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-center border-b pb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/auth/cartas" className="p-3 bg-white rounded-xl shadow-sm hover:bg-slate-100 transition-all border">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Editor <span className="text-blue-600">Sanson</span></h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">ID de Entrada</p>
                        <p className="text-[10px] font-mono text-slate-300 italic">{id}</p>
                    </div>
                </header>

                <form onSubmit={handleUpdate} className="space-y-10">
                    {/* Navegación por Pasos */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto">
                        <button type="button" onClick={() => setStep(1)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 1 ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Configuración</button>
                        <button type="button" onClick={() => setStep(2)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 2 ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Cuerpo de Carta</button>
                    </div>

                    {step === 1 ? (
                        <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6 text-left">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic">Título Principal</label>
                                        <input name="titulo" value={formData.titulo || ""} onChange={handleInputChange} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold text-xl" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic">Fecha o Período</label>
                                        <input name="fecha" value={formData.fecha || ""} onChange={handleInputChange} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic">Bajada / Descripción</label>
                                        <textarea name="descripcion_titulo" value={formData.descripcion_titulo || ""} onChange={handleInputChange} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl h-32 resize-none outline-none focus:ring-2 ring-blue-500 font-medium" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic mb-2 leading-none">Portada (Cover)</label>
                                    <div className="flex-1 bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 relative overflow-hidden group hover:border-blue-400 transition-all">
                                        {(files.imagen_titulo || formData.imagen_titulo) ? (
                                            <img src={files.imagen_titulo ? URL.createObjectURL(files.imagen_titulo) : formData.imagen_titulo} className="w-full h-full object-cover" />
                                        ) : <Plus className="m-auto absolute inset-0 text-slate-200" size={40}/>}
                                        <input type="file" name="imagen_titulo" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <section key={num} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-4 space-y-4 text-left">
                                            <div className="h-56 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 relative overflow-hidden hover:bg-white transition-all">
                                                {(files[`img${num}`] || formData[`img${num}`]) ? (
                                                    <img src={files[`img${num}`] ? URL.createObjectURL(files[`img${num}`] as File) : formData[`img${num}`]} className="w-full h-full object-cover" />
                                                ) : <div className="m-auto absolute inset-0 text-slate-200 font-black text-xs text-center uppercase">Foto {num}</div>}
                                                <input type="file" name={`img${num}`} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2 italic leading-none">Subtítulo {num}</label>
                                                <input name={`subtxt${num}`} value={formData[`subtxt${num}`] || ""} onChange={handleInputChange} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-green-500 italic text-sm font-medium" />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-8 flex flex-col text-left">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic mb-2 leading-none">Texto {num}</label>
                                            <textarea name={`texto${num}`} value={formData[`texto${num}`] || ""} onChange={handleInputChange} className="w-full flex-1 p-6 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-green-500 text-lg leading-relaxed min-h-[200px]" />
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    <div className="pt-8 pb-20 flex gap-4">
                        <button type="button" onClick={() => setStep(step === 1 ? 2 : 1)} className="px-10 py-5 bg-slate-200 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 flex items-center gap-2">
                            {step === 1 ? <>Siguiente <ChevronRight size={16}/></> : "Volver"}
                        </button>
                        <button type="submit" disabled={updating} className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-600 transition-all shadow-2xl disabled:bg-slate-300">
                            {updating ? "Guardando..." : "Finalizar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}