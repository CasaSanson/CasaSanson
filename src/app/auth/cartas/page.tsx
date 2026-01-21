"use client"
import { PlusCircle, EditIcon, Trash2 } from "lucide-react" // Cambié Delete por Trash2 que es más común
import Link from "next/link"

export default function AdminCartas(){
    return(
        <main className="px-20 min-h-screen bg-white text-black">
            <div className="flex flex-col mx-auto">
                <h1 className="text-center text-4xl mt-10 font-bold">
                    Cartas Casa Sansón
                </h1>
                <p className="mt-10 px-[20%] text-center text-gray-600">
                    Este es el espacio para administrar nuestras cartas: crearlas, editarlas o borrarlas. 
                    Es muy importante avisar al CTO si se presenta algún error. 
                    Revisen la página principal tras cada cambio.
                </p>
            </div>

            <div className="mt-20 flex justify-center gap-10">
                {/* CREAR */}
                <div className="border-4 border-green-600 rounded-xl overflow-hidden flex flex-col items-center w-64">
                    <PlusCircle className="h-24 w-24 text-green-600 my-6" />
                    <Link href="/auth/cartas/crear" className="w-full">
                         <button className="text-white bg-green-600 p-4 text-2xl w-full font-bold hover:bg-green-700 transition-colors">
                            CREAR CARTA
                         </button>
                    </Link>
                </div>

                {/* EDITAR - Ahora lleva a la LISTA para elegir cuál editar */}
                <div className="border-4 border-blue-600 rounded-xl overflow-hidden flex flex-col items-center w-64">
                    <EditIcon className="h-24 w-24 text-blue-600 my-6" />
                    <Link href="/auth/cartas/lista" className="w-full">
                         <button className="text-white bg-blue-600 p-4 text-2xl w-full font-bold hover:bg-blue-700 transition-colors">
                            EDITAR CARTA
                         </button>
                    </Link>
                </div>

                {/* BORRAR - También lleva a la LISTA pero para eliminar */}
                <div className="border-4 border-red-600 rounded-xl overflow-hidden flex flex-col items-center w-64">
                    <Trash2 className="h-24 w-24 text-red-600 my-6" />
                    <Link href="/auth/cartas/lista" className="w-full">
                         <button className="text-white bg-red-600 p-4 text-2xl w-full font-bold hover:bg-red-700 transition-colors">
                            BORRAR CARTA
                         </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}