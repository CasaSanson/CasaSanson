"use client";
import { useState } from "react";


export default function Header(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <section className="h-auto md:h-[100%] bg-[#f1efe0] relative">
          
          <div className="relative w-[100%] md:w-full h-[500px] md:h-[950px] mx-auto">
          <video
            src="/costurera.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay dinámico */}
        {isOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 transition-all duration-500">
            <p className="text-white text-sm md:text-xl mb-4">
              1. Creemos en la belleza imperfecta del movimiento.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              2. Honramos la sastrería desde la artesanía, no desde la norma.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              3. Diseñamos para todos los cuerpos que buscan congruencia, no etiquetas.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              4. La ropa debe acompañar el ritmo de la vida, no imponerla.
            </p>
            <p className="text-white text-sm md:text-xl mb-4">
              5. La calidad no es un lujo: es una forma de respeto.
            </p>
          </div>
        )}
      </div>

      {/* Botón toggle debajo del video */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group absolute left-1/2 -translate-x-1/2 bottom-10 pointer-events-auto px-4 md:px-12 py-2 md:py-4 bg-black backdrop-blur-sm text-white text-sm md:text-xl rounded-none border-2 border-black transition-all duration-700 hover:bg-gray-500/20 hover:text-black hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg z-50"
      >
        {isOpen ? "X" : "Manifiesto"}
      </button>
    </section>
    )
}