import React from 'react'
import Image from 'next/image'

interface InstaxPhotoProps {
  src: string
  alt: string
  title?: string
  date?: string
  className?: string
}

const InstaxPhoto: React.FC<InstaxPhotoProps> = ({ 
  src, 
  alt, 
  title = "Memoria", 
  date = "2024",
  className = ""
}) => {
  return (
    <div className={`instax-photo ${className}`}>
      {/* Marco principal estilo Instax */}
      <div className="relative bg-black w-80 h-96 border-[12px] border-black shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
  {/* Área de la imagen - más grande */}
  <div className="relative w-full h-80 bg-gray-100">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
        {/* Área de texto (parte inferior blanca) */}
        <div className="px-4 py-3 bg-black min-h-[60px] flex flex-col ">
          <h3 className="text-lg font-medium text-white text-left ">
            {title}
          </h3>
          <p className="text-lg text-white text-right justify-start">
            {date}
          </p>
        </div>
        
        {/* Efecto de brillo sutil */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

export default InstaxPhoto