"use client";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Adaptamos la interface a los nuevos nombres de columna
interface Entrada {
  id: string; // Cambiado a string por el UUID
  titulo: string; // Antes: nombre
  imagen_titulo: string; // Antes: cover
  fecha: string;
  // Nota: Si ya no usas hover_cover en el nuevo panel, 
  // repetiremos la imagen principal para que no se rompa el efecto group-hover
}

export default function Journal() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntradas = async () => {
      const { data, error } = await supabase
        .from("entradas")
        .select("*")
        .order("created_at", { ascending: false }); // Ordenamos por creación para que lo más nuevo salga primero

      if (error) {
        console.error("Error fetching entradas:", error);
      } else if (data) {
        setEntradas(data);
      }
      setLoading(false);
    };

    fetchEntradas();
  }, []);

  if (loading) return <p className="mx-auto text-3xl mt-[50%]">Cargando...</p>;

  return (
    <div>
      <main>
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-3 justify-left mt-[10%] flex flex-col text-left mx-auto mb-10">
          {entradas.map((ent) => (
            <div key={ent.id} className="flex image flex-col overflow-hidden">
              <div className="group relative h-[700px] mt-[10%] flex overflow-hidden">
                <Link href={`/diario/ver/${ent.id}`}>
                  {/* Imagen Principal */}
                  <Image 
                    src={ent.imagen_titulo} // Mapeado a la nueva columna
                    alt=""
                    width={600}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                  />
                  {/* Imagen de Hover (Usamos la misma si no definiste una nueva en el backend) */}
                  <Image 
                    src={ent.imagen_titulo} 
                    alt=""
                    width={600}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  />
                </Link>
              </div>
              
              <h1 className="text-lg ml-9 font-bold w-30 text-gray-700 mt-2">{ent.titulo}</h1> {/* Mapeado a titulo */}
              <p className="text-gray-500 ml-9">{ent.fecha}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}