"use client";
import Link from "next/link";

export default function Tape(){
    return(
        <section className="grid grid-cols-1 md:grid-cols-3 bg-white gap-2 h-auto md:h-full mb-7">
            {/* primera columna */}
            <div className="col-span-1 flex flex-col space-y-1 mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                  <img src="/1.png" alt="Lino" className="w-full mx-auto h-full object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1  mx-auto">
                <button className="bg-white/60  text-black font-bold border-black border-2 hover:bg-cs-verde-musgo hover:text-white z-10 text-left p-4 w-auto h-10 pt-2 ml-2 mt-2">
                  MATERIALES
                </button>
              </div>
              </div>
              {/* segunda columna */}
            <div className="col-span-1 flex flex-col mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                <img src="/2.png" alt="Lino" className="w-full mx-auto h-full object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1  mx-auto">
              <button className="bg-white/60 text-black font-bold border-black border-2 hover:bg-cs-verde-musgo hover:text-white z-10 text-left p-4 w-auto h-10 pt-2 ml-2 mt-2">
                  VER MÁS
                </button>
              </div>
              </div>
              {/* tercera columna */}
              <div className="col-span-1 flex flex-col  mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                <img src="/3.png" alt="Lino" className="w-full mx-auto Z-48 h-full object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1  mx-auto mb-10">
              <button className="bg-white/60 text-black font-bold border-black border-2 hover:bg-cs-verde-musgo hover:text-white z-10 text-left p-4 w-auto h-10 pt-2 ml-2 mt-2">
                  VER MÁS
                </button>
              </div>
              </div>
        </section>
    )
}