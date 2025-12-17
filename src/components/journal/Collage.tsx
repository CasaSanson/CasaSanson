"use client";
import { useState, useEffect } from "react";

export default function Collage(){
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
    
    return(
        <>
        <div className="block md:hidden w-[90%] h-full mx-auto" >
            <img
            src={collage[currentIndex].src}
            alt={collage[currentIndex].alt}
            className={collage[currentIndex].className}
          />

          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {collage.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                    currentIndex === index ? "bg-transparent" : "bg-gray-300"
                }`}
                ></button>
            ))}
            </div> 
            </>
    )
}