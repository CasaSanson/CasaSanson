"use client"
import { useParams } from "next/navigation";
import libros from "@/lib/libros/libro";
import Link from "next/link";

export default function VerBiblioteca() {
    const params = useParams();
    const { id } = params;
    const libro = libros.find(l => l.id === Number(id));
    if (!libro) return <p>No existe este libro</p>;
    
    // Asignar el componente directamente (debe estar en mayúscula para JSX)
    const HeyzineComponent = libro.heyzine;
    
    return (
        <div className="h-full overflow-y-hidden">
        <div className="mt-[5%]  px-3 flex">
         <Link href={"/biblioteca"} className="ml-auto mr-10 flex items-center justify-center">
          <button className="bg-black text-xl text-white p-2 hover:bg-cs-verde-musgo rounded-full w-10 h-10">
            X
          </button>
         </Link>
          </div>

          {/* render dinámico del componente */}
          {HeyzineComponent && <HeyzineComponent />}
          <div className="flex">
          <h1 className="mx-auto  mb-10 text-xl">{libro.nombre} | <span className="mx-auto mt-10 mb-10 text-xl font-bold">{libro.descripcion}</span> </h1>
          </div>
        </div>
    )
}