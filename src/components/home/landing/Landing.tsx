"use client";
import { useState } from "react"
import RippleEffect from "@/components/RippleEffect";
import Image from "next/image";
import Link from "next/link";



export default function Landing() {

  const handleEnterWebsite = () => {
    window.dispatchEvent(new Event('enterhome')); // Dispara el evento
  };
  return (
    <div className="fixed inset-0  bg-cover bg-center h-screen w-screen flex items-center justify-center z-50 relative overflow-hidden">
      {/* Fondo con Ripple */}
      <div className="absolute inset-0 ">
        <RippleEffect
          style={{
            backgroundImage: 'url(/luna.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          autoDrops={true}
          options={{ perturbance: 0.02, dropRadius: 70 }}
        />
      </div>
      <div className="absolute top-0 left-1/2 w-[3px] h-[20%] bg-gray-500 animate-line-down"></div>
      <div className="absolute bottom-0 left-1/2 w-[3px] h-[20%] bg-gray-500 animate-line-up"></div>
      <div className="relative z-10 bg-black/30 pointer-events-none flex flex-col items-center justify-center text-center w-auto md:w-[40%] h-[50%] md:h-[100%] mx-auto px-8 animate-slideUp">

        {/* Logo o título principal */}
        <div className="mb-2">

          <Image src="/sanson_white.png" alt="Casa Sansón" width={400} height={400} className="mx-auto md:hidden"></Image>
          <h1 className="text-4xl text-white hidden md:block mb-7">CASA SANSÓN</h1>

          <div className="text-gray-500 bg-transparent mx-auto mb-8">Est. 2025</div>
          <p className="text-xl  text-gray-300 font-light drop-shadow-md">
            La búsqueda de belleza y armonía a través de la forma y la materia.
          </p>

          <p className="text-gray-300 text-md mt-10 mx-auto mb-7">
            Primavera/Verano 26/27
          </p>


        </div>

        {/* Botón de entrada */}
        <Link href={"/home"}>
          <button
            className="group relative pointer-events-auto px-12 py-4 bg-black  text-white text-xl rounded-none border-2 border-black transition-all duration-700 hover:bg-cs-verde-musgo hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg"
          >
            <span className="relative z-30 text-md text-gray-500 ">COMING SOON...</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </Link>


      </div>
    </div>

  )
}