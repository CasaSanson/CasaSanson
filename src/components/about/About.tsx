"use client";
export default function About() {

  return (
    <div className="px-6">
      {/* section de la coleccion */}
      <section className="hidden md:block w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-2 h-full md:h-full ">
        <div className="col-span-1">
          <p className="text-black font-bold header-item text-lg w-[60%] h-full mx-auto mt-[40%] md:mt-[53%] m-7">
            Una historia, una tradición, una cultura…
          </p>

        </div>
        <div className="flex flex-col bg-black/90">
          <img src="/about/about1.jpg" alt="Vogue" className="w-full h-full object-contain" />
        </div>
      </section>
      <section className="block md:hidden w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-2 h-full md:h-full ">
        <div className="col-span-1">
        <div className="flex flex-col mt-18">
          <img src="/about/about1.jpg" alt="Vogue" className="w-full h-full object-contain" />
        </div>
          <p className="text-black  header-item text-xl w-full h-full mx-auto  md:mt-[53%] m-7">
            Una historia, una tradición, una cultura…
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
          <p className="text-black text-lg w-full mx-auto m-7">
            Nuestro mundo nos llevó a aunar ideas
            e ilusiones con el propósito de crear Casa Sansón
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
            Creamos prendas para ser queridas y recordadas.
            <br />
            <br />
            Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
            procurando siempre preservar este precioso mundo.
          </p>
          <br></br>
          <p>
            Creamos prendas para ser queridas y recordadas.
            Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,

            procurando siempre preservar este precioso mundo.
          </p>
        </div>
        <div className="col-span-1">
          <img src="/about/about3_2.jpg" alt="Vogue" className="w-full  h-full object-cover" />
        </div>
      </section>

      {/* Third Columns */}
      <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-3 mt-[10%] flex items-center md:h-full h-auto ">
        <div className="col-span-1">
          <p className="text-justify px-4 text-lg w-full mt-[20%] mx-auto">
            Creamos prendas para ser queridas y recordadas.
            <br />
            <br />
            Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
            <br />
            <br />
            procurando siempre preservar este precioso mundo.
          </p>
        </div>
        <div className="col-span-1">
          <img src="/about/about4.jpg" alt="Vogue" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-1">
          <img src="/about/about6.jpg" alt="Vogue" className="w-full h-full" />
        </div>
      </section>
    </div>
  )
}