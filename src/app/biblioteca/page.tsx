import libros from "@/lib/libros/libro"
import Image from "next/image"
import Link from "next/link"
export default function Biblioteca(){
    return(
        <>
         <div className="grid grid-cols-1 md:grid-cols-3 px-3 justify-left mt-[10%] flex flex-col text-left mx-auto mb-10">
            {libros.map((libro) => (
                <div className="" key={libro.id}>
                    <Link href={`/biblioteca/ver/${libro.id}`}>
                    <Image 
                     src={libro.book_cover}
                     alt=""
                     width={2000}
                     height={2000}
                     className="hover:scale-105 transition-all duration-300"
                     >
                    </Image>
                    </Link>
                    <h1 className="text-lg ml-9 font-bold w-30 text-gray-700">{libro.nombre}</h1>
                    <p className="text-gray-500 ml-9">{libro.descripcion}</p> 
                </div>

            ))}

         </div>
          
        </>
    )
}