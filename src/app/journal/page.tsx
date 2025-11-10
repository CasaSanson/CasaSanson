"use client";
import { useEffect, useState } from "react";
import RippleEffect from "@/components/RippleEffect";

export default function Journal() {
    const collage=[
        {
            src: "/collage1.png",
            alt: "Collage",
            className: "w-[150%] h-[100%] object-cover ml-[2%]"
        },
        {
            src: "/collage22.png",
            alt: "Collage",
            className: "w-[150%] h-[100%] object-cover ml-[2%]"
        },
        {
            src: "/collage3.png",
            alt: "Collage",
            className: "w-[150%] h-[100%] object-cover ml-[2%]"
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === collage.length - 1 ? 0 : prevIndex + 1
        );
      };

      const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? collage.length - 1 : prevIndex - 1
        );
      };

      useEffect(() => {
        const interval = setInterval(() => {
          nextSlide();
        }, 800);
        return () => clearInterval(interval);
      }, [currentIndex]);
      

  return (
    <div>
      <main className="bg-white  bg-center h-[60vh] mt-[10vh] w-screen pt-18 relative">
        <section className="py-16  h-[70vh] w-full mx-auto  border-b border-black">
          <div className=" w-[90%] h-[88%] mx-auto" >
            <img
            src={collage[currentIndex].src}
            alt={collage[currentIndex].alt}
            className={collage[currentIndex].className}
          />
          <button onClick={prevSlide} className="ml-[10%] absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl bg-black rounded-full p-2"></button>
          <button onClick={nextSlide} className="mr-[10%] absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl bg-black rounded-full p-2"></button>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {collage.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                    currentIndex === index ? "bg-gray-800" : "bg-gray-300"
                }`}
                ></button>
            ))}
            </div>
        </section>

        <section className="py-16 mb-24 bg-[#FDE6BB] w-full mx-auto">
            <div className="w-[60%] mx-auto">
                <div className="flex justify-center items-center grid grid-cols-2">
                   <h2 className="text-4xl font-bold mt-[20%] ">
                    A quien corresponda:
                   </h2>
                   <p className="text-black text-md ml-[60%] ">
                    2 de noviembre de 2025
                   </p>
                </div>
            <p className="text-black text-lg mt-[10%] w-full sm:text-base md:text-lg lg:text-xl xl:text-lg">
                        Dejaré mi casa por ti,
            dejaré mi barrio y me iré
            lejos de aquí.
            crusare llorando el jardín,
            y con tus recuerdos partiré
            lejos de aquí.

            De día viviré
            pensando en tus sonrisas,
            de noche las estrellas
            me acompañarán.
            Serás como una luz
            que alumbre mi camino;
            me voy, pero te juro
            que mañana volveré.

            y al partir, un beso y una flor,
            un te quiero, una caricia y un adiós;
            es ligero equipaje
            para tan largo viaje,
            las penas pesan en el corazón.
            Más allá del mar habrá una flor
            donde cada mañana brille más;
            forjarán mi destino
            las piedras del camino, lo que nos es querido siempre queda atrás

            Dejaré mi casa por ti,
            dejaré mi barrio y me iré
            lejos de aquí.
            cruzaré llorando el jardín,
            y con tus recuerdos partiré
            lejos de aquí.

            De día viviré
            pensando en tus sonrisas,
            de noche las estrellas
            me acompañarán.
            Serás como una luz
            que alumbre mi camino;
            me voy, pero te juro
            que mañana volveré.
            y al partir, un beso y una flor,
            un te quiero, una caricia y un adiós;
            es ligero equipaje
            para tan largo viaje,
            las penas pesan en el corazón.
            Más allá del mar habrá una flor
            donde cada mañana brille más;
            forjarán mi destino
            las piedras del camino, lo que nos es querido siempre queda atrás.
            </p>
            </div>
            <div className="w-[60%] mx-auto grid grid-cols-[2fr_1fr] gap-10 pt-16">
                <p className="text-black text-lg w-full mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. 
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. 
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.  
                </p>
                <img
                src="/tiempo.png"
                alt="Forest"
                className="w-[500px] h-[500px] object-cover opacity-80"
                />
            </div>
            <div className="w-[60%] mx-auto  pt-24">
            <p className="text-black text-lg w-full mx-auto">
                Con cariño,
               </p>
               <p className="text-black text-lg w-full mx-auto pt-4">
                Lorena Casas.
               </p>
               <img
               src="/firma_lore-removebg-preview.png"
               alt="Forest"
               className="w-[200px] h-[200px] object-cover opacity-80"
               />
            </div>
        </section>
        <footer className="bg-[#111111] text-white py-8">
          <div className="container mx-auto px-4">
            <p className="text-center">
              &copy; 2025 Casa Sansón. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </main> 
    </div>
  );
}