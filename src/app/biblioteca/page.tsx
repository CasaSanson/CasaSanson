"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export default function Biblioteca() {
    const [libros, setLibros] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLibros = async () => {
            // Hacemos el fetch a la tabla 'libros' ordenando por los más recientes
            const { data, error } = await supabase
                .from("libros")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Error cargando libros:", error.message)
            } else {
                setLibros(data || [])
            }
            setLoading(false)
        }

        fetchLibros()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl animate-pulse text-gray-400 font-bold uppercase tracking-widest">
                    Cargando Biblioteca...
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 px-3 justify-left mt-[10%] text-left mx-auto mb-10 gap-y-10">
                {libros.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-400 py-20">
                        No hay libros disponibles en este momento.
                    </p>
                ) : (
                    libros.map((libro) => (
                        <div className="flex flex-col" key={libro.id}>
                            <Link href={`/biblioteca/ver/${libro.id}`}>
                                <div className="overflow-hidden rounded-lg mb-4 mx-9">
                                    <Image 
                                        src={libro.cover} // Usamos el campo 'cover' de la DB
                                        alt={libro.titulo}
                                        width={2000}
                                        height={2000}
                                        className="hover:scale-105 transition-all duration-300 object-cover aspect-[3/4]"
                                        priority={false}
                                    />
                                </div>
                            </Link>
                            {/* Ajustamos los nombres de los campos a los de tu tabla libros */}
                            <h1 className="text-lg ml-9 font-bold text-gray-700 uppercase leading-tight">
                                {libro.titulo}
                            </h1>
                            <p className="text-gray-500 ml-9 text-sm line-clamp-3 mt-2 pr-4">
                                {libro.descripcion}
                            </p> 
                        </div>
                    ))
                )}
            </div>
        </>
    )
}