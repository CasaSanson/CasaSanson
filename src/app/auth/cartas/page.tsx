"use client"
import { PlusCircle, Edit3, Trash2, ArrowRight, Layout, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminCartas() {
    return (
        <main className="min-h-screen bg-[#fcfcfc] p-8 lg:p-20 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera Editorial */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20 border-b pb-12 border-slate-100">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-600 h-2 w-10 rounded-full"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 italic">Management Suite</p>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">
                            Cartas <span className="text-slate-300">Sansón</span>
                        </h1>
                        <p className="max-w-2xl text-slate-400 font-medium text-lg leading-relaxed">
                            Bienvenido al centro de control editorial. Desde aquí puedes gestionar el contenido del diario, 
                            asegurando que cada historia y catálogo mantenga la esencia de <span className="text-slate-900 font-bold">Casa Sansón</span>.
                        </p>
                    </div>
                    <div className="bg-slate-50 border p-6 rounded-[2.5rem] flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm">
                            <Layout className="text-blue-600" size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Estado del Sistema</p>
                            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">Conexión Segura con Supabase</p>
                        </div>
                    </div>
                </header>

                {/* Grid de Acciones Principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    {/* ACCIÓN: CREAR */}
                    <Link href="/auth/cartas/crear" className="group">
                        <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-100 relative overflow-hidden h-full">
                            <div className="bg-green-50 p-8 rounded-[2.5rem] mb-8 group-hover:scale-110 transition-transform duration-500">
                                <PlusCircle className="h-16 w-16 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-slate-800">Crear Entrada</h2>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">Publica nuevas cartas con 6 bloques de contenido multimedia.</p>
                            <div className="mt-auto flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                Empezar ahora <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    {/* ACCIÓN: EDITAR */}
                    <Link href="/auth/cartas/lista" className="group">
                        <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 relative overflow-hidden h-full">
                            <div className="bg-blue-50 p-8 rounded-[2.5rem] mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Edit3 className="h-16 w-16 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-slate-800">Modificar Diario</h2>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">Ajusta textos, cambia imágenes o actualiza la fecha de tus cartas.</p>
                            <div className="mt-auto flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                Abrir Listado <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    {/* ACCIÓN: BORRAR (GESTIONAR) */}
                    <Link href="/auth/cartas/lista" className="group">
                        <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-100 relative overflow-hidden h-full">
                            <div className="bg-red-50 p-8 rounded-[2.5rem] mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Trash2 className="h-16 w-16 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-slate-800">Purgar Registros</h2>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">Elimina entradas antiguas. Recuerda avisar al equipo técnico antes.</p>
                            <div className="mt-auto flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest">
                                Ir a Gestión <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer de Soporte */}
                <footer className="mt-24 bg-slate-900 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md">
                            <AlertCircle className="text-blue-400" size={32} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-black text-xl uppercase italic tracking-tight">Atención al CTO</h3>
                            <p className="text-white/40 text-sm font-medium">En caso de error 400 o fallos en la subida, contactar de inmediato.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic">
                            V 3.0 Editorial Hub
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    )
}