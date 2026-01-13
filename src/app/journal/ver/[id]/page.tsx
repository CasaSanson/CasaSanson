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
    id: number;
    nombre: string;
    cover: string;
    fecha: string;
    hover_cover: string;
    img1?: string;
    img2?: string;
    img3?: string;
    img4?: string;
    img5?: string;
    text1?: string;
    text2?: string;
    text3?: string;
    text4?: string;
    text5?: string;
    text6?: string;
    text7?: string;
}

export default function Verjournal() {
    const params = useParams();
    const { id } = params;
    const [carta, setCarta] = useState<Entrada | null>(null);
    const [loading, setLoading] = useState(true);

    // useGSAP(() => {
    //     if (!carta) return;
      
    //     gsap.utils.toArray<HTMLElement>(".text-scroll").forEach((el) => {
    //       gsap.from(el, {
    //         y: 80,
    //         scrollTrigger: {
    //           trigger: el,
    //           start: "top 90%",
    //           end: "top 60%",
    //           scrub: 1,
    //         },
    //       });
    //     });
    //   }, [carta]);
      

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
        <div className="mt-[10%] px-[20%]">
            <Link href={"/journal"} className="inline-flex gap-1">
                <ArrowLeftFromLine className="text-gray-500 hover:text-black cursor-pointer" />
                <p className="text-lg uppercase text-gray-500 hover:text-black cursor-pointer">Regresar</p>
            </Link>
            <div className="mx-auto flex flex-col mt-10 text-center ">
                <h1 className="font-bold text-5xl mb-8">{carta.nombre}</h1>

                {carta.img1 && (
                    <Image
                        src={carta.img1}
                        alt="imagen1"
                        width={900}
                        height={600}
                        className="mx-auto mb-4 w-full h-full"
                    />
                )}

                {carta.text1 && (
                    <p className="mb-8 px-4 mt-10 text-xl font-bold px-[15%] text-scroll">{carta.text1}</p>
                )}

                {carta.text2 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.text2}</p>
                )}

                {carta.img2 && (
                    <Image
                        src={carta.img2}
                        alt="imagen2"
                        width={900}
                        height={600}
                        className="mx-auto mb-8 px-[10%] text-scroll"
                    />
                )}

                {carta.text3 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.text3}</p>
                )}



                {carta.img3 && (
                    <div className="w-full h-full bg-[#E3DBCC] flex items-center mb-8 text-scroll">
                        <Image
                            src={carta.img3}
                            alt="imagen2"
                            width={900}
                            height={600}
                            className="mx-auto px-[10%] p-10"
                        />
                    </div>
                )}

                {carta.text4 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%] text-scroll">{carta.text4}</p>
                )}

                {carta.img4 && (

                    <Image
                        src={carta.img4}
                        alt="imagen2"
                        width={900}
                        height={600}
                        className="mx-auto px-[10%] mb-8"
                    />

                )}

                {carta.text5 && (
                    <p className="text-lg mb-8 px-4 text-left px-[15%]">{carta.text5}</p>
                )}

                




            </div>
        </div>
    )
}