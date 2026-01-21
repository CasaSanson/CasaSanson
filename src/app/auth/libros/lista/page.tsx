"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft, Loader2, Book, ExternalLink } from "lucide-react"

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

    useEffect(() => {
        fetchLibros()
    }, [])

    const eliminarLibro = async (id: number, titulo: string) => {
        const confirmar = confirm(`¿Estás seguro de eliminar el libro: "${titulo}"?`);
        
        if (confirmar) {
            setDeletingId(id)
            const { error } = await supabase
                .from("libros")
                .delete()
                .eq("id", id)

            if (error) {
                alert("Error al eliminar: " + error.message)
                setDeletingId(null)
            } else {
                setLibros(libros.filter(l => l.id !== id))
                setDeletingId(null)
                alert("Libro eliminado correctamente")
            }
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p>Cargando biblioteca administrativa...</p>
        </div>
    )

    return (
        <main className="p-8 max-w-6xl mx-auto bg-white text-slate-900 min-h-screen">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/auth/libros" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Gestión de Libros</h1>
                </div>
                <Link href="/auth/libros/subir" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-all flex items-center gap-2">
                    <Book size={18} /> NUEVO LIBRO
                </Link>
            </div>

            {/* Grid de Libros */}
            <div className="grid grid-cols-1 gap-6">
                {libros.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                        <p className="text-slate-400">Aún no hay libros en la biblioteca.</p>
                    </div>
                ) : (
                    libros.map((libro) => (
                        <div key={libro.id} className="flex flex-col md:flex-row items-center gap-6 p-6 border-2 border-slate-50 rounded-3xl hover:border-blue-100 transition-all bg-white shadow-sm">
                            {/* Portada */}
                            <img 
                                src={libro.cover} 
                                className="w-24 h-32 object-cover rounded-xl shadow-md" 
                                alt={libro.titulo} 
                            />

                            {/* Info */}
                            <div className="flex-grow text-center md:text-left">
                                <h2 className="text-xl font-bold text-slate-800">{libro.titulo}</h2>
                                <p className="text-slate-500 text-sm line-clamp-1 mb-2">{libro.descripcion}</p>
                                <a 
                                    href={libro.heyzine_link} 
                                    target="_blank" 
                                    className="text-blue-500 text-xs flex items-center justify-center md:justify-start gap-1 hover:underline"
                                >
                                    <ExternalLink size={12} /> Ver en Heyzine
                                </a>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => eliminarLibro(libro.id, libro.titulo)}
                                    disabled={deletingId === libro.id}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {deletingId === libro.id ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                    BORRAR
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}