"use client";
import { equipo } from "@/lib/equipo";

export default function Dashboard(){
    return (
        <main className="mt-10">
            {/*Header*/}
            <section className="h-[10vh] bg-white">
                <h1 className="text-black  text-6xl mx-auto flex flex-col text-center p-3">
                    Bienvenido a Casa Sansón Org.
                </h1>
            </section>
            {/*Descripcion*/}
            <section className="bg-white h-[40vh px-3 w-auto">
                <p className="text-black p-4 text-xl mx-auto text-center">
                    Este es nuestro centro de control, aquí voy a agregar cosas que nos ayuden con la operación del día a día.
                </p>
                <img
                src="/lospanas.jpg"
                className="mx-auto">
                </img>
            </section>
          


        </main>
    )
}