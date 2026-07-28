"use client";
export default function About() {

  return (
    <div className="px-6">
      {/* section de la coleccion */}
      <section className="hidden md:grid w-full mx-auto bg-white grid-cols-1 md:grid-cols-2 items-center h-full">
        <div>
          <p className="text-black text-center header-item text-xl w-full h-full mx-auto mt-17">
            Historia, materia, técnica y tiempo...
          </p>
        </div>
        <div className="flex flex-col mt-18">
          <img src="/about/about1.jpg" alt="Vogue" className="w-full h-full object-contain" />
        </div>
      </section>

      <section className="block md:hidden w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-2 h-full md:h-full ">
        <div className="col-span-1">
          <div className="flex flex-col mt-20">
            <img src="/about/about1.jpg" alt="Vogue" className="w-full h-full object-contain" />
          </div>
          <p className="text-black  header-item text-xl w-full h-full mx-auto  md:mt-[53%] m-7">
            Historia, materia, técnica y tiempo...
          </p>

        </div>

      </section>


      {/* First Columns */}
      <section className="w-full flex items-center mx-auto bg-obsidian/90 grid grid-cols-1 md:grid-cols-3 md:mt-10 gap-10  md:h-full h-auto ">
        <div className="col-span-1">
          <img src="/about/about2.jpg" alt="Vogue" className="w-full h-full object-cover" />
        </div>

        <div className="col-span-1">
          <img src="/about/about2_1.jpg" alt="Vogue" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-black text-lg w-full mx-auto m-7 ">
            Esta búsqueda, fundamentalmente táctil, nos ha llevado a valorar aquellos materiales con los que mantenemos una conexión ancestral: la lana, el algodón y el lino, cuyas propiedades nos recuerdan nuestra cercanía con la fuente original.
          </p>
        </div>
      </section>

      {/* Second Columns */}
      <section className="w-full mx-auto flex items-center bg-white grid grid-cols-1 md:grid-cols-3 mt-[10%] md:h-full h-full">
        <div className="col-span-1">
          <img src="/about/about3_1.jpg" alt="Vogue" className="h-full w-full" />
        </div>
        <div className="col-span-1 text-lg text-justify px-10 mt-10 mb-10">
          <p >
            La búsqueda de Casa Sansón comienza en lo material, y se conjuga en un mundo simbólico, donde la configuración de los textiles adquiere nuevos significados que reflejan una forma ancestral de habitar y relacionarnos.<br></br><br></br>A través de la manipulación de los textiles buscamos evocar narrativas y emociones, reflejos de la transmutación material que ocurre tanto en el tejido como en nuestro ser.
          </p>
        </div>
        <div className="col-span-1">
          <img src="/about/about3_2.jpg" alt="Vogue" className="w-full  h-full object-cover" />
        </div>
      </section>

      {/* Third Columns */}
      <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-3 gap-4 mt-[10%] flex items-center md:h-full h-auto ">
        <div className="col-span-1">
          <p className="text-justify px-4 text-lg w-full mt-[20%] mx-auto mb-[20%]">
            La forma nace de las distintas cualidades de cada textil, permitiendo la congruencia entre lo que se ve, lo que se contiene y lo que se siente.

          </p>
          <p className="text-justify px-4 text-lg w-full mt-[20%] mx-auto mb-[20%] hidden md:block">
            Estos conceptos se entrelazan en un proceso continuo de análisis y experimentación, del cual nacen cada una de las piezas que diseñamos. Nuestra intención es abrir este camino de investigación y, junto a ustedes, evocar las emociones que lo habitan.
            Casa Sansón
          </p>
        </div>
        <div className="col-span-1">
          <img src="/about/about4.jpg" alt="Vogue" className="w-full mb-5 h-full object-cover" />
        </div>
        <div className="col-span-1">
          <img src="/about/about6.jpg" alt="Vogue" className="w-full h-full" />
        </div>
        <p className="text-justify px-4 text-lg w-full mt-[20%] mx-auto mb-[20%] block md:hidden ">
            Estos conceptos se entrelazan en un proceso continuo de análisis y experimentación, del cual nacen cada una de las piezas que diseñamos. <br></br><br></br>Nuestra intención es abrir este camino de investigación y evocar las emociones que lo habitan. <br></br><br></br><br></br>
             <span className="font-bold uppercase">Casa Sansón</span>
          </p>
      </section>
    </div>
  )
}