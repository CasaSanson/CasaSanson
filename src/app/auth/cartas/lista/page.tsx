"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function ListaGestionCartas() {
    const [cartas, setCartas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Función para obtener las cartas
    const fetchCartas = async () => {
        try {
            const { data, error } = await supabase
                .from("entradas")
                .select("id, nombre, fecha, cover")
                .order('created_at', { ascending: false })
            
            if (error) throw error
            if (data) setCartas(data)
        } catch (error: any) {
            console.error("Error al cargar cartas:", error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCartas()
    }, [])

    // Función para eliminar carta
    const eliminarCarta = async (id: number, nombre: string) => {
        const confirmar = confirm(`¿Estás seguro de eliminar "${nombre}"?\nEsta acción no se puede deshacer.`);
        
        if (confirmar) {
            setDeletingId(id)
            
            const { error } = await supabase
                .from("entradas")
                .delete()
                .eq("id", id)

            if (error) {
                alert("Error al eliminar: " + error.message)
                setDeletingId(null)
            } else {
                setCartas(cartas.filter(c => c.id !== id))
                setDeletingId(null)
                toast("Carta eliminada con éxito")
            }
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
            <p className="text-xl font-medium">Cargando panel de gestión...</p>
        </div>
    )

    return (
        <main className="p-10 max-w-5xl mx-auto bg-white text-black min-h-screen">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-10 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/auth/cartas" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Administrar Cartas</h1>
                        <p className="text-gray-500 text-sm">Edita o elimina registros de Casa Sansón</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold border border-blue-100">
                        {cartas.length} cartas
                    </span>
                </div>
            </div>

            {/* Lista de Cartas */}
            <div className="grid gap-6">
                {cartas.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                        <p className="text-gray-400 text-lg">No hay cartas para mostrar.</p>
                        <Link href="/auth/cartas/crear" className="text-blue-600 font-bold hover:underline">
                            Crea la primera aquí
                        </Link>
                    </div>
                ) : (
                    cartas.map((carta) => (
                        <div key={carta.id} className="flex flex-col md:flex-row items-center justify-between p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center gap-6 w-full">
                                <img 
                                    src={carta.cover || "/api/placeholder/150/150"} 
                                    className="w-20 h-20 object-cover rounded-xl shadow-inner border border-gray-100" 
                                    alt={carta.nombre} 
                                />
                                <div>
                                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">{carta.nombre}</h2>
                                    <p className="text-blue-600 font-medium">{carta.fecha || "Sin fecha"}</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">ID: {carta.id}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                {/* BOTÓN EDITAR */}
                                <Link 
                                    href={`/auth/cartas/editar/${carta.id}`}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    <Pencil size={18} />
                                    EDITAR
                                </Link>

                                {/* BOTÓN BORRAR */}
                                <button 
                                    onClick={() => eliminarCarta(carta.id, carta.nombre)}
                                    disabled={deletingId === carta.id}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-600 border-2 border-red-50 px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50"
                                >
                                    {deletingId === carta.id ? (
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