"use client";
import Link from "next/link";

export default function Tape(){
    return(
        <section className="grid grid-cols-1 md:grid-cols-3 bg-white h-auto md:h-[80vh] mb-7">
            {/* primera columna */}
            <div className="col-span-1 flex flex-col space-y-1 mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                  <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1 mx-auto">
                <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                  Ver más
                </button>
              </div>
              </div>
              {/* segunda columna */}
            <div className="col-span-1 flex flex-col mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1 mx-auto">
                <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                  Ver más
                </button>
              </div>
              </div>
              {/* tercera columna */}
              <div className="col-span-1 flex flex-col  mt-[10%]">
              <div className="row-span-1">
                <Link href="/catalogo">
                <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
                </Link>
              </div>
              <div className="row-span-1 mx-auto mb-10">
                <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                  Ver más
                </button>
              </div>
              </div>
        </section>
    )
}