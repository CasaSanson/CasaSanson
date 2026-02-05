"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/shop/interfaces";

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants (*)
        `)
        .eq("active", true);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="mx-auto text-3xl mt-[50%] text-center">Cargando productos...</p>;

  // IMPORTANTE: Aquí debe ir el return que envuelve todo el componente
  return (
    <section className="w-full mx-auto bg-cs-white bg-cover bg-center h-full pt-[15%] md:pt-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[90%] mx-auto pt-[5%]">
        {products.map((product) => {
          // Lógica de cálculo de stock
          const totalStock = product.product_variants?.reduce(
            (acc, variant) => acc + (variant.stock || 0), 
            0
          ) || 0;
          const isAgotado = totalStock === 0;

          return (
            <div key={product.id} className="flex flex-col items-start justify-start relative">
              {/* Contenedor de imagen con Overlay de Agotado */}
              <Link 
                href={`/catalogo/ver/${product.id}`} 
                className={`relative w-full overflow-hidden border-2 border-cs-vino group ${isAgotado ? 'pointer-events-none' : ''}`}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover ${isAgotado ? 'grayscale brightness-150' : ''}`} 
                />
                
                {/* Filtro Inset cuando está agotado */}
                {isAgotado && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white  text-2xl uppercase tracking-[.2]  px-4 py-2">
                      Agotado
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col justify-between w-full mt-3">
                <h2 className="text-lg font-bold text-cs-negro uppercase">{product.name}</h2>
                <p className="text-black text-lg">${product.base_price}</p>
                
                {/* Texto debajo del precio si no hay stock */}
                {isAgotado && (
                  <p className="text-red-800 font-bold text-sm uppercase mt-1">
                    AGOTADO
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}