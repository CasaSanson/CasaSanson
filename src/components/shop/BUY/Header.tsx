"use client";
import Link from "next/link";
import { products } from "@/lib/products";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Header(){
    const { id } = useParams();
    const product = products.find((product) => product.id === parseInt(id as string));
    if (!product) return null;
    
    return(
        <>
        <div className="mb-6">
                    <Link href={`/catalogo/ver/${product.id}`} className="text-blackhover:text-red-900 text-sm">
                        ← Volver a la tienda
                    </Link>
                </div>
                <div className="mx-auto">
                 <Image
                  src="/sanson_black.png"
                  alt="Casa Sansón"
                  width={300}
                  height={300}
                  className="mx-auto">

                 </Image>
                </div>
                <div className="mx-auto">
                    <p className="text-gray-600 text-center mb-6">
                        Todos los pagos son procesados de forma segura y confiable.
                    </p>
                </div>
                </>
    )
}