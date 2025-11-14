"use client";
import { products } from "@/lib/products";
import Link from "next/link";
export default function Catalogo() {
    return (
        <main className="bg-white min-h-screen w-[100%] mx-auto">
            {/* section de la coleccion */}
            <section className="hidden md:block w-full mx-auto bg-black h-[20%] pt-[15%] md:pt-[5%]">
                <h1 className="text-4xl font-bold text-center text-white">Nuestros Diseños</h1>
            </section>

            {/* section de las imagenes de la coleccion con hover */}
            <section className="hidden md:block w-full mx-auto bg-[url(/black.jpeg)] bg-cover bg-center w-[80%] h-[80%]">
                <div className="grid grid-cols-2 w-[70%] mx-auto h-[820px]">
                <div className="group relative h-[700px] mt-[10%] flex items-center justify-center overflow-hidden  border-4 border-black">
                    <img
                        src="/modelo12.png"
                        alt="Vogue"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        />

                        {/* Imagen 2: aparece en hover */}
                    <img
                        src="/modelo31.png"
                        alt="Jacob Elordi"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        />
                    </div>
                    <div className="group relative h-[700px] mt-[10%] flex items-center justify-center overflow-hidden  border-4 border-black">
                    <img
                        src="/modelo77.png"
                        alt="Vogue"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        />

                        {/* Imagen 2: aparece en hover */}
                    <img
                        src="/about3.jpg"
                        alt="Jacob Elordi"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        />
                    </div>
                </div>
            </section>

            {/* Productos */}
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

            {/* section del porque elegirnos */}
            <section className="hidden md:block w-[80%] mx-auto h-[40vh] bg-white pt-[5%]">
                <h1 className="text-4xl font-bold text-center text-gray-300">Así nacímos</h1>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p className="text-gray-300 text-center text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </section>

            {/* footer */}
            <footer className="bg-[#111111] pt-[5%] text-white py-8">
          <div className="container mx-auto px-4">
            <p className="text-center">
              &copy; 2025 Casa Sansón. Todos los derechos reservados.
            </p>
          </div>
        </footer>
        </main>
    );
}