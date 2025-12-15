"use client";
import { products } from "@/lib/products";
import Link from "next/link";

export default function Store(){
    return(
        <section className="w-full mx-auto bg-white bg-cover bg-center h-full pt-[15%] md:pt-[5%]">
                <h1 className="text-4xl text-center text-black">Productos</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-[90%] mx-auto pt-[5%] ">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col items-start justify-start">
                           <Link href={`/catalogo/ver/${product.id}`} className="w-full aspect-square overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                           </Link>
                            <div className="flex flex-col items-start justify-start w-full">
                                <h2 className="text-md text-black pt-[4%]">{product.name}</h2>
                                <p className="text-black text-md pt-[4%]">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

    )
}