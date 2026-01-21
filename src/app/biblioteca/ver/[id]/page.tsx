"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";

export default function VerBiblioteca() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [libro, setLibro] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibro = async () => {
            const { data, error } = await supabase
                .from("libros")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                console.error("Error cargando libro:", error);
                setLibro(null);
            } else {
                setLibro(data);
            }
            setLoading(false);
        };

        if (id) fetchLibro();
    }, [id, supabase]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!libro) return (
        <div className="h-full flex flex-col items-center justify-center">
            <p className="text-xl mb-4 text-gray-500 font-bold">No se encontró este libro</p>
            <Link href="/biblioteca" className="text-blue-600 underline">Volver a la biblioteca</Link>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* Cabecera con Botón Cerrar */}
            <div className="pt-6 pb-2 px-6 flex justify-between items-center mt-[7%]">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-800">{libro.titulo}</h1>
                </div>
                <Link href="/biblioteca">
                    <button className="bg-black text-white hover:bg-gray-700 transition-colors rounded-full w-10 h-10 flex items-center justify-center">
                        <X size={20} />
                    </button>
                </Link>
            </div>

            {/* Visualizador de Heyzine */}
            <div className="h-full w-full bg-gray-100 relative">
                {libro.heyzine_link ? (
                    <iframe
                        src={libro.heyzine_link}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="clipboard-write"
                    ></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={libro.cover} alt={libro.titulo} className="max-h-[70%] rounded-lg shadow-2xl mb-4" />
                        <p className="text-gray-400 italic">Este libro no tiene visualizador interactivo configurado.</p>
                    </div>
                )}
            </div>

            {/* Footer con descripción */}
            <div className="p-4 bg-white border-t border-gray-100">
                <p className="text-center text-gray-600">
                    <span className="font-bold text-gray-900">{libro.titulo}</span> | {libro.descripcion}
                </p>
            </div>
        </div>
    )
}