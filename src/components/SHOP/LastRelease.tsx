"use client";

export default function LastRelease(){
    return(
        <>
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
            </>
    )
    
}