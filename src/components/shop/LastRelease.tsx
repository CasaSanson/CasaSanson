"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LastRelease() {
    
    return (
        <>
            {/* section de las imagenes de la coleccion con hover */}
            <section className=" w-full mx-auto bg-white bg-cover bg-center w-[80%] h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-6xl mx-auto h-full">
                    {/*foto1*/}
                    <div className="group relative h-[700px] mt-[20%]  flex  overflow-hidden  border-4 border-cs-vino">
                        <img
                            src="/hoverbeto.jpg"
                            alt="Vogue"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        />
                        <img 
                         src="/beto.jpg"
                         className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                        </img>
                        <Link href={"/catalogo/ver/3681c764-e474-4083-abb0-560d82051f79"} className="absolute">
                        <button className="bg-white/60 text-black font-bold border-black border-2 hover:bg-cs-verde-musgo hover:text-white z-10 text-left p-4 w-auto h-10 pt-2 ml-2 mt-2">
                            NUEVO
                        </button>
                        </Link>
                    </div>
                    {/*2*/}
                    <div className="group relative h-[700px] mt-[20%]  flex  overflow-hidden  border-4 border-cs-vino">
                        <img
                            src="/catalogo1.png"
                            alt="Vogue"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        />
                        <img 
                         src="/catalogohover.png"
                         className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                        </img>
                        <Link href={"/catalogo"} className="absolute bottom-4 right-4">
                        <button className="bg-white/60  text-black font-bold border-black border-2 hover:bg-cs-verde-musgo hover:text-white z-10 text-left p-4 w-auto h-10 pt-2 ml-2 mt-2">
                            CATÁLOGO
                        </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )

}