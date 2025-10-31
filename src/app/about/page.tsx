"use client";

import RippleEffect from "@/components/RippleEffect";

export default function About() {
  return (
    <>
    <main className="bg-gradient-to-t from-[#ffffff] to-[#222222] min-h-screen w-screen pt-18 relative">
      <section className="py-16 border-gray-700 mb-24 h-[100vh] w-full mx-auto ">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-4xl font-bold animate-fade-in mb-6 pt-16 text-white">Casa Sansón</h2>
          <p className="text-white font-serif text-lg animate-fade-in">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </div>
        <div className="group relative w-[40%] left-[50%] translate-x-[-50%] h-[1000px] flex items-center justify-center overflow-hidden mt-[5%] border-4 border-black">
  {/* Imagen 1: visible por defecto */}
  <img
    src="/about2.png"
    alt="Vogue"
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
  />

  {/* Imagen 2: aparece en hover */}
  <img
    src="/about3.jpg"
    alt="Jacob Elordi"
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
  />
</div>

      </section>

      {/* section de la historia de la marca */}
      <section className="py-16 border-gray-700 mb-24 h-[120vh] w-full mx-auto bg-[#111111] ">
        <div className="grid grid-cols-2 justify-center items-center">
          <div className="col-span-1">
            <h2 className="text-4xl font-bold animate-fade-in mb-6 pt-16 ml-[10%] text-white">Casa Sansón</h2>
            <p className="text-white font-serif text-lg animate-fade-in mr-[60%] ml-[10%]">
              Casa Sansón is a brand that sells products that are made with love and care.
            </p>
          </div>  
        </div>
        <div className="grid grid-cols-3 ml-[10%] justify-center items-center mt-[10%] ">
          <img src="/about3.jpg" alt="About" className="col-span-1 w-[70%] h-[100%] object-cover border-2 border-gray-500" />
          <img src="/about5.png" alt="About" className="col-span-1 w-[70%] h-[100%] object-cover border-2 border-gray-500" />
          <img src="/about3.jpg" alt="About" className="col-span-1 w-[70%] h-[100%] object-cover border-2 border-gray-500" />
        </div>
      </section>
      {/* section de la historia de la marca */}
      <section className="py-16 border-gray-700 mb-24 h-[110vh] w-full mx-auto bg-[#111111] ">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-4xl font-bold animate-fade-in mb-6 pt-16 text-white">Casa Sansón</h2>
        </div>
      </section>
    </main>
    </>
  );
}