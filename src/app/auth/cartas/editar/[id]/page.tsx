"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ImagePlus, Type, Info, Calendar, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthEditarCarta() {
    const router = useRouter()
    const { id } = useParams()
    
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [formData, setFormData] = useState<any>({})
    const [files, setFiles] = useState<{ [key: string]: File | null }>({})

    useEffect(() => {
        const fetchCarta = async () => {
            if (!id) return;
            const { data, error } = await supabase.from("entradas").select("*").eq("id", id).single();
            if (error) {
                toast.error("Error al cargar datos");
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
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
        return data.publicUrl
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        try {
            const updatedUrls: { [key: string]: string } = {}
            for (const key in files) {
                if (files[key]) {
                    const targetBucket = (key === 'cover' || key === 'hover_cover') ? 'CARTA COVER' : 'CARTA_IMG'
                    const url = await uploadToBucket(files[key]!, targetBucket)
                    updatedUrls[key] = url
                }
            }
            const { error } = await supabase.from("entradas").update({ ...formData, ...updatedUrls }).eq("id", id)
            if (error) throw error
            toast.success("¡Carta actualizada con éxito!")
            router.push("/auth/cartas")
        } catch (error: any) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-screen font-bold">Cargando información de la carta...</div>

    return (
        <main className="p-4 md:p-8 max-w-6xl mx-auto bg-white text-slate-900 min-h-screen mb-20">
            {/* Header de navegación */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/auth/cartas" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800">Editor de Contenido</h1>
                    <p className="text-slate-500 italic">Modificando: {formData.nombre}</p>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-12">
                
                {/* SECCIÓN 1: IDENTIDAD DE LA CARTA */}
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-100 pb-2">
                        <Info className="text-blue-600" size={20} />
                        <h2 className="font-bold text-xl uppercase">1. Información Principal</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-1"><Type size={14}/> Nombre Visible</label>
                            <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleInputChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" placeholder="Ej: Menú de Temporada" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-1"><Calendar size={14}/> Fecha o Temporada</label>
                            <input type="text" name="fecha" value={formData.fecha || ""} onChange={handleInputChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" placeholder="Ej: Invierno 2024" />
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 2: PORTADAS (BUCKET: CARTA COVER) */}
                <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-6">
                        <ImagePlus className="text-blue-600" size={20} />
                        <h2 className="font-bold text-xl uppercase">2. Portadas de Selección</h2>
                    </div>
                    <p className="text-sm text-blue-700 mb-6 bg-blue-100/50 p-3 rounded-lg">
                        <strong>Nota para el equipo:</strong> Estas son las imágenes que se ven en el listado principal. La "Imagen de Portada" es la fija, y la "Imagen de Hover" es la que aparece al pasar el ratón por encima.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Portada Principal */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <label className="text-sm font-black block mb-3 text-slate-700">Imagen de Portada (Fija)</label>
                            <div className="flex flex-col gap-4">
                                {formData.cover && <img src={formData.cover} className="w-full h-48 object-cover rounded-xl border" alt="Actual" />}
                                <input type="file" name="cover" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                            </div>
                        </div>

                        {/* Portada Hover */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <label className="text-sm font-black block mb-3 text-slate-700">Imagen de Hover (Al pasar el mouse)</label>
                            <div className="flex flex-col gap-4">
                                {formData.hover_cover && <img src={formData.hover_cover} className="w-full h-48 object-cover rounded-xl border" alt="Actual" />}
                                <input type="file" name="hover_cover" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 3: CONTENIDO INTERNO (BUCKET: CARTA_IMG) */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-2">
                        <Type className="text-green-600" size={20} />
                        <h2 className="font-bold text-xl uppercase">3. Contenido Detallado</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-8">
                        Aquí subimos las fotos de las cartas o detalles que van <strong>dentro</strong> de la carta. No es obligatorio llenar todos los campos.
                    </p>

                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="group grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 border-2 border-slate-100 rounded-3xl hover:border-green-200 hover:bg-green-50/30 transition-all">
                                {/* Subida de Imagen */}
                                <div className="lg:col-span-4 space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-400 group-hover:text-green-600 transition-colors tracking-widest">Fotografía {num}</label>
                                    {formData[`img${num}`] && (
                                        <div className="relative">
                                            <img src={formData[`img${num}`]} className="w-full h-32 object-cover rounded-2xl shadow-sm border-2 border-white" />
                                            <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">Actual</span>
                                        </div>
                                    )}
                                    <input type="file" name={`img${num}`} onChange={handleFileChange} className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-green-600 hover:file:text-white cursor-pointer transition-all" />
                                </div>
                                
                                {/* Texto descriptivo */}
                                <div className="lg:col-span-8 space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-400 group-hover:text-green-600 transition-colors tracking-widest">Descripción o Título {num}</label>
                                    <textarea 
                                        name={`text${num}`} 
                                        value={formData[`text${num}`] || ""} 
                                        onChange={handleInputChange} 
                                        className="w-full border-2 border-slate-200 p-4 rounded-2xl focus:border-green-500 outline-none transition-all min-h-[120px] bg-white"
                                        placeholder={`Describe la imagen ${num} o añade contenido aquí...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BOTÓN FLOTANTE O FIJO AL FINAL */}
                <div className="pt-10">
                    <button 
                        type="submit" 
                        disabled={updating}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-200 disabled:bg-slate-300 flex items-center justify-center gap-4 group"
                    >
                        {updating ? (
                            <>Subiendo cambios al sistema...</>
                        ) : (
                            <>
                                <Save className="group-hover:scale-110 transition-transform" />
                                GUARDAR CAMBIOS EN LA CARTA
                            </>
                        )}
                    </button>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        Al presionar este botón, las imágenes nuevas se subirán a Supabase Storage y los textos se actualizarán en la base de datos.
                    </p>
                </div>
            </form>
        </main>
    )
}