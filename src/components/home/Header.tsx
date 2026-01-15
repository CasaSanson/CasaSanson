"use client";
import { useState } from "react";


export default function Header(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <section className="h-auto md:h-full bg-[#f1efe0] relative">
          
          <div className="relative w-[100%] md:w-full h-[900px] md:h-full mx-auto">
          <video
            src="/lore_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay dinámico */}
        {isOpen && (
          <div className="absolute px-4 inset-0 flex flex-col items-center justify-center bg-black/50 z-10 transition-all duration-500">
            <p className="text-white text-sm md:text-xl mb-4">
              1. CREEMOS EN LA BELLEZA IMPERFECTA DEL MOVIMIENTO
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              2. HONRAMOS LA SASTRERÍA DESDE LA ARTESANÍA, NO DESDE LA NORMA
            </p>
            

            <p className="text-white text-sm md:text-xl mb-4">
              3. DISEÑAMOS PARA TODOS LOS CUERPOS QUE BUSCAN CONGRUENCIA, NO ETIQUETAS
            </p>
  
            <p className="text-white text-sm md:text-xl mb-4">
              4. LA ROPA DEBE ACOMPAÑAR EL RITMO DE LA VIDA, NO IMPONERLA
            </p>
            <p className="text-white text-sm md:text-xl mb-4">
              5. LA CALIDAD NO ES UN LUJO: ES UNA FORMA DE RESPETO
            </p>
          </div>
        )}
      </div>

      {/* Botón toggle debajo del video */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group absolute left-1/2 -translate-x-1/2 bottom-10 pointer-events-auto px-4 md:px-12 py-2 md:py-4 bg-black backdrop-blur-sm text-white text-sm md:text-xl rounded-none border-2 border-black transition-all duration-700 hover:bg-cs-verde-musgo hover:text--cs-azul hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg z-40"
      >
        {isOpen ? "X" : "MANIFIESTO"}
      </button>
    </section>
    )
}