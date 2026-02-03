"use client"
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftFromLine } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger)

interface Entrada {
    id: string; // UUID
    titulo: string; // nombre
    imagen_titulo: string; // cover
    descripcion_titulo?: string; // Nuevo campo
    fecha: string;
    // Bloques mapeados a tu diseño actual
    texto1?: string; img1?: string; subtxt1?: string;
    texto2?: string; img2?: string; subtxt2?: string;
    texto3?: string; img3?: string; subtxt3?: string;
    texto4?: string; img4?: string; subtxt4?: string;
    texto5?: string; img5?: string; subtxt5?: string;
    texto6?: string; img6?: string; subtxt6?: string;
}

export default function Verjournal() {
    const params = useParams();
    const { id } = params;
    const [carta, setCarta] = useState<Entrada | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntrada = async () => {
            const { data, error } = await supabase
                .from("entradas")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching entrada:", error);
            } else if (data) {
                setCarta(data);
            }
            setLoading(false);
        };

        fetchEntrada();
    }, [id]);

    if (loading) return <p className="mx-auto text-3xl mt-[50%]">Cargando...</p>;
    if (!carta) return <p className="mx-auto text-3xl mt-[50%]">Entrada no encontrada</p>;

    return (
        <div className="mt-[10%] md:px-[20%]">
            <Link href={"/journal"} className="inline-flex gap-1">
                <ArrowLeftFromLine className="text-gray-500 hover:text-black cursor-pointer" />
                <p className="text-lg uppercase text-gray-500 hover:text-black cursor-pointer">Regresar</p>
            </Link>
            <div className="mx-auto flex flex-col mt-10 text-center ">
                {/* Título adaptado */}
                <h1 className="font-bold text-5xl mb-8">{carta.titulo}</h1>

                {/* Bloque 1 - Imagen y Texto de introducción */}
                {carta.img1 && (
                    <Image
                        src={carta.img1}
                        alt="imagen1"
                        width={900}
                        height={600}
                        className="mx-auto mb-4 w-full h-full"
                    />
                )}

                {carta.texto1 && (
                    <p className="mb-8 px-4 mt-10 text-xl font-bold px-[15%] text-scroll">{carta.texto1}</p>
                )}

                {carta.subtxt1 && (
                    <p className="mb-8 px-4 mt-10 text-xl font-bold px-[15%] text-scroll">{carta.subtxt1}</p>
                )}

                {/* Bloque 2 */}
                {carta.texto2 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.texto2}</p>
                )}

                {carta.img2 && (
                    <div className="space-y-2 mb-8">
                        <Image
                            src={carta.img2}
                            alt="imagen2"
                            width={900}
                            height={600}
                            className="mx-auto px-[10%] text-scroll"
                        />
                        {carta.subtxt2 && <p className="text-xs italic text-gray-400">{carta.subtxt2}</p>}
                    </div>
                )}

                {/* Bloque 3 - El que tiene el fondo color crema */}
                {carta.texto3 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.texto3}</p>
                )}

                {carta.img3 && (
                    <div className="w-full h-full bg-[#E3DBCC] flex flex-col items-center mb-8 text-scroll">
                        <Image
                            src={carta.img3}
                            alt="imagen3"
                            width={900}
                            height={600}
                            className="mx-auto px-[10%] p-10"
                        />
                        {carta.subtxt3 && <p className="pb-4 text-xs italic text-gray-700">{carta.subtxt3}</p>}
                    </div>
                )}

                {/* Bloque 4 */}
                {carta.texto4 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.texto4}</p>
                )}

                {carta.img4 && (
                    <div className="space-y-2 mb-8">
                        <Image
                            src={carta.img4}
                            alt="imagen4"
                            width={900}
                            height={600}
                            className="mx-auto px-[10%]"
                        />
                        {carta.subtxt4 && <p className="text-xs italic text-gray-400">{carta.subtxt4}</p>}
                    </div>
                )}

                {/* Bloque 5 */}
                {carta.texto5 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%]">{carta.texto5}</p>
                )}

                {/* Bloque 6 - Extra por si usas el sexto bloque en el futuro */}
                {carta.img5 && (
                    <Image
                        src={carta.img5}
                        alt="imagen5"
                        width={900}
                        height={600}
                        className="mx-auto px-[10%] mb-8"
                    />
                )}
            </div>
        </div>
    )
}