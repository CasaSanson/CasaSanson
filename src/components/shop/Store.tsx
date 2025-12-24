"use client";
import { products } from "@/lib/products";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product, ProductVariant } from "@/lib/shop/interfaces";

  
export default function Store(){
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
            setProducts(data);
          }
          setLoading(false);
        };
    
        fetchProducts();
      }, []);
    
      if (loading) return <p>Cargando productos...</p>;
    return(
        <section className="w-full mx-auto bg-cs-white bg-cover bg-center h-full pt-[15%] md:pt-[5%]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-[90%] mx-auto pt-[5%] ">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col items-start justify-start">
                           <Link href={`/catalogo/ver/${product.id}`} className="w-full  overflow-hidden border-2 border-cs-vino">
                                <img src={product.image} alt={product.name} className="w-full  h-full object-cover" />
                           </Link>
                            <div className="flex flex-col justify-between w-full">
                                <h2 className="text-lg font-bold text-cs-negro">{product.name}</h2>
                                <p className="text-black text-lg mb-7">${product.base_price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

    )
}