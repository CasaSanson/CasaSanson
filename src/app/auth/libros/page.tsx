"use client"
import { UploadCloudIcon, EditIcon, Trash2, Book } from "lucide-react" // Cambié Delete por Trash2 que es más común
import Link from "next/link"

export default function AdminLibros(){
    return(
        <main className="px-20 min-h-screen bg-gray-100 text-black">
            <div className="flex flex-col">
                <h1 className="text-black text-4xl mt-10 font-bold">
                    Libros Casa Sansón
                </h1>
                <p className="mt-10  text-gray-600">
                    Este es el espacio para administrar nuestross libros: crearlas, editarlas o borrarlas. <br></br>
                    Es muy importante avisar al CTO si se presenta algún error. <br></br>
                    Revisen la página principal tras cada cambio.
                </p>
            </div>

            <div className="mt-20 flex justify-center gap-10">
                {/* CREAR */}
                <div className="border-4 border-green-600 rounded-xl overflow-hidden flex flex-col items-center w-64">
                    <UploadCloudIcon className="h-24 w-24 text-green-600 my-6" />
                    <Link href="/auth/libros/subir" className="w-full">
                         <button className="text-white bg-green-600 p-4 text-2xl w-full font-bold hover:bg-green-700 transition-colors">
                            SUBIR LIBRO
                         </button>
                    </Link>
                </div>
                {/* BORRAR - También lleva a la LISTA pero para eliminar */}
                <div className="border-4 border-red-600 rounded-xl overflow-hidden flex flex-col items-center w-64">
                    <Trash2 className="h-24 w-24 text-red-600 my-6" />
                    <Link href="/auth/cartas/lista" className="w-full">
                         <button className="text-white bg-red-600 p-4 text-2xl w-full font-bold hover:bg-red-700 transition-colors">
                            BORRAR LIBRO
                         </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}