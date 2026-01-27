"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthCrearCarta() {
    const [loading, setLoading] = useState(false)
    
    // 1. Estado para los textos
    const [formData, setFormData] = useState({
        nombre: "", fecha: "",
        text1: "", text2: "", text3: "", text4: "", text5: "", text6: "", text7: ""
    })

    // 2. Estado para los archivos
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        cover: null, hover_cover: null, 
        img1: null, img2: null, img3: null, img4: null, img5: null
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles({ ...files, [e.target.name]: e.target.files[0] })
        }
    }

    // Función de subida dinámica según el bucket
    const uploadToBucket = async (file: File, bucketName: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const imageUrls: { [key: string]: string } = {}

            // Procesar cada archivo según su destino
            for (const key in files) {
                const file = files[key]
                if (file) {
                    // Lógica de buckets:
                    // Si es cover o hover_cover va a "carta cover", el resto a "carta_img"
                    const targetBucket = (key === 'cover' || key === 'hover_cover') 
                        ? 'carta cover' 
                        : 'carta_img'
                    
                    const url = await uploadToBucket(file, targetBucket)
                    imageUrls[key] = url
                }
            }

            // Insertar todo en la tabla 'entradas'
            const { error } = await supabase.from("entradas").insert([
                {
                    ...formData,
                    ...imageUrls
                }
            ])

            if (error) throw error
            alert("¡Carta creada y fotos subidas correctamente!")
            
        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message || 'No se pudo completar la operación'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="p-8 max-w-5xl mx-auto bg-white text-black min-h-screen">
            <h1 className="text-3xl font-bold mb-8 border-b pb-4">Portal de Creación de Cartas</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECCIÓN 1: DATOS BÁSICOS Y PORTADAS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div className="col-span-2">
                        <h2 className="text-lg font-semibold mb-4 text-blue-700">1. Información Principal y Portadas</h2>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Nombre de la Carta</label>
                        <input type="text" name="nombre" onChange={handleInputChange} className="border p-2 rounded" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Fecha (ej: Enero 2024)</label>
                        <input type="text" name="fecha" onChange={handleInputChange} className="border p-2 rounded" />
                    </div>

                    <div className="flex flex-col gap-2 border-l-4 border-blue-400 pl-4">
                        <label className="text-sm font-bold">Imagen de Portada (Cover)</label>
                        <input type="file" name="cover" onChange={handleFileChange} accept="image/*" className="text-xs" />
                    </div>

                    <div className="flex flex-col gap-2 border-l-4 border-blue-400 pl-4">
                        <label className="text-sm font-bold">Imagen de Hover</label>
                        <input type="file" name="hover_cover" onChange={handleFileChange} accept="image/*" className="text-xs" />
                    </div>
                </section>

                {/* SECCIÓN 2: CONTENIDO INTERNO */}
                <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-6 text-green-700">2. Contenido de la Carta (Bucket: carta_img)</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded bg-white">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium italic">Imagen {num}</label>
                                    <input type="file" name={`img${num}`} onChange={handleFileChange} accept="image/*" className="text-xs" />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-medium">Texto {num}</label>
                                    <textarea name={`text${num}`} onChange={handleInputChange} rows={2} className="border p-2 rounded w-full" />
                                </div>
                            </div>
                        ))}
                        
                        {/* Textos adicionales sin imagen (6 y 7) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea name="text6" placeholder="Texto extra 6" onChange={handleInputChange} className="border p-2 rounded" />
                            <textarea name="text7" placeholder="Texto extra 7" onChange={handleInputChange} className="border p-2 rounded" />
                        </div>
                    </div>
                </section>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                    {loading ? "Procesando subida doble..." : "PUBLICAR CARTA EN SUPABASE"}
                </button>
            </form>
        </main>
    )
}