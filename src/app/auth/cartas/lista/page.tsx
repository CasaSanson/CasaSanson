"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft, Loader2, Search, BookOpen, AlertCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function ListaGestionCartas() {
    const [cartas, setCartas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchCartas = async () => {
        try {
            // Actualizado a las nuevas columnas: titulo e imagen_titulo
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

    useEffect(() => {
        fetchCartas()
    }, [])

    const eliminarCarta = async (id: string, titulo: string) => {
        const confirmar = confirm(`¿Purgar "${titulo}" del Diario?\nEsta acción eliminará todos los bloques de texto y fotos.`);
        
        if (confirmar) {
            setDeletingId(id)
            const { error } = await supabase
                .from("entradas")
                .delete()
                .eq("id", id)

            if (error) {
                toast.error("No se pudo eliminar: " + error.message)
                setDeletingId(null)
            } else {
                setCartas(cartas.filter(c => c.id !== id))
                toast.success("Entrada purgada exitosamente")
                setDeletingId(null)
            }
        }
    }

    const filteredCartas = cartas.filter(c => 
        c.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Accediendo a los archivos de Casa Sansón...</p>
        </div>
    )

    return (
        <main className="min-h-screen bg-[#fcfcfc] p-6 lg:p-12 text-slate-900 font-sans">
            <ToastContainer position="top-right" theme="dark" />
            
            <div className="max-w-5xl mx-auto">
                {/* Header Estilo Hub */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b pb-10">
                    <div className="flex items-center gap-6">
                        <Link href="/auth/cartas" className="p-4 bg-white border rounded-2xl hover:bg-slate-50 transition-all shadow-sm group">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Gestión <span className="text-blue-600">Editorial</span></h1>
                            <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-2 italic">Casa Sansón Hub: Diario</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {cartas.length} Entradas
                        </span>
                    </div>
                </header>

                {/* Buscador */}
                <div className="relative mb-10 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar entrada por título..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 p-5 pl-16 rounded-[2rem] outline-none focus:border-blue-500 font-bold transition-all shadow-sm"
                    />
                </div>

                {/* Lista de Entradas */}
                <div className="grid gap-4">
                    {filteredCartas.length === 0 ? (
                        <div className="text-center py-24 bg-white border-4 border-dashed rounded-[3rem] border-slate-100">
                            <BookOpen className="mx-auto mb-4 text-slate-200" size={64} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">El diario está vacío</p>
                            <Link href="/auth/cartas/crear" className="text-blue-600 font-black text-xs uppercase mt-4 inline-block hover:underline tracking-tighter">
                                Publicar primera entrada
                            </Link>
                        </div>
                    ) : (
                        filteredCartas.map((carta) => (
                            <div key={carta.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img 
                                            src={carta.imagen_titulo || "/api/placeholder/150/150"} 
                                            className="w-full h-full object-cover" 
                                            alt={carta.titulo} 
                                        />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h2 className="font-black text-2xl text-slate-800 uppercase tracking-tighter truncate leading-none mb-1">{carta.titulo || "Sin Título"}</h2>
                                        <div className="flex items-center gap-3">
                                            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest italic">{carta.fecha || "Pendiente de fecha"}</p>
                                            <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                            <p className="text-[9px] font-mono text-slate-300 truncate italic tracking-tighter">REF: {carta.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto">
                                    <Link 
                                        href={`/auth/cartas/editar/${carta.id}`}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                                    >
                                        <Pencil size={14} />
                                        Editar
                                    </Link>

                                    <button 
                                        onClick={() => eliminarCarta(carta.id, carta.titulo)}
                                        disabled={deletingId === carta.id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-500 border-2 border-red-50 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-30"
                                    >
                                        {deletingId === carta.id ? (
                                            <Loader2 className="animate-spin" size={14} />
                                        ) : (
                                            <>
                                                <Trash2 size={14} />
                                                Borrar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer simple */}
                <footer className="mt-20 pb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full border border-slate-200">
                        <AlertCircle size={14} className="text-slate-400" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Las entradas eliminadas no se pueden recuperar.</p>
                    </div>
                </footer>
            </div>
        </main>
    )
}