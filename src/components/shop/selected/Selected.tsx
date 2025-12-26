"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccordionComponent } from "@/components/Accordion";
import { Product, ProductVariant } from "@/lib/shop/interfaces";
import { ToastContainer, toast } from 'react-toastify';


export default function Selected({ params }: { params: { id: string } }) {
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const notify = () => toast('Hemos recibido tu información, nos pondremos en contacto a la brevedad.');

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [personalizedText, setPersonalizedText] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [email, setEmail] = useState("");
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Fetch producto desde Supabase
    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, product_variants(*)")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching product:", error);
            } else if (data) {
                setProduct(data);
                // Seleccionamos la primera variante con stock > 0
                const firstAvailable = data.product_variants.find((v: ProductVariant) => v.stock > 0);
                if (firstAvailable) setSelectedSize(firstAvailable.size);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Cargando producto...</p>;
    if (!product) return <p>Producto no encontrado</p>;

    // Todas las tallas, mostrando stock
    const sizes = product.product_variants.map((v) => ({
        size: v.size,
        stock: v.stock,
    }));

    const selectedVariant = product.product_variants.find((v) => v.size === selectedSize);
    const displayPrice = selectedVariant?.price || product.base_price;
    const isMaquila = product.maquila === true;
    const isPersonalizado = product.personalizacion == true;


    const saveMaquilaLead = async () => {
        const { error } = await supabase
            .from("maquila_leads")
            .insert({
                email,
                product_id: product.id,
                product_name: product.name,
            });

        if (error) {
            console.error("Error guardando lead:", error);
            throw error;
        }
    };

    const handleSizeClick = (size: string) => {
        setSelectedSize(size);
    };


    return (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <div className="max-w-9xl mx-auto mt-[6%] md:mt-13">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">

                    {/* Imagen izquierda */}
                    <div className="col-span-1 flex justify-center lg:justify-start border-3 border-gray-800">
                        <div className="relative overflow-hidden shadow-2xl cursor-zoom-in ">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={600}
                                height={600}
                                className={`transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"} `}
                                style={{ transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }}
                            />
                        </div>
                    </div>

                    {/* Interior chaqueta / personalización */}
                    <div className="col-span-1  px-6 relative">
                        {isPersonalizado ? (
                            <>
                                <img src="/interior_verde.png" alt="Interior chaqueta" className="w-full h-full object-cover border-3 border-gray-300 border" />
                                {personalizedText && (
                                    <p
                                        className="absolute text-gray-800 text-xl font-semibold"
                                        style={{
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontFamily: "Times New Roman",
                                        }}
                                    >
                                        {personalizedText}
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="hidden sm:hidden">

                            </div>
                        )}

                    </div>

                    {/* Información del producto derecha */}
                    <div className="flex flex-col items-start text-center space-y-4 px-6 justify-start w-full">
                        <div className="text-left">
                            <p className="text-3xl text-black">{product.name}</p>
                            <p className="text-md text-gray-800 py-2 mb-5">${displayPrice}</p>

                            {/* Selección de talla */}
                            <p className="hidden md:block text-xl text-gray-800 py-2">Talla:</p>
                            {isMaquila ? (
                                <div className="hidden md:flex grid-cols-5 space-x-6 mt-4">
                                    {sizes.map(({ size, stock }) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeClick(size)}
                                            disabled={stock === 0}
                                            className={`border border-black px-4 py-2 text-sm transition-colors duration-300 ${selectedSize === size
                                                ? "bg-cs-verde-musgo text-white"
                                                : stock > 0
                                                    ? "bg-white text-black hover:bg-cs-verde-musgo hover:text-white"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            <span className={stock === 0 ? "line-through" : ""}>
                                                {size} {stock === 0}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                            ) : (
                                <div className="text-black">
                                    Este producto es solo bajo pedido, por favor compártenos tu correo electrónico.
                                </div>
                            )}



                            {/* Personalización */}
                            <div className="mt-10">
                                {isPersonalizado ? (
                                    <>
                                        <p className="text-lg text-gray-800">Para:</p>
                                        <input
                                            type="text"
                                            placeholder="Hazlo tuyo"
                                            className="w-full mb-2 mt-2 border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                                            value={personalizedText}
                                            onChange={(e) => setPersonalizedText(e.target.value)}
                                            maxLength={9}
                                            required
                                        />
                                    </>
                                ) : (
                                    <div>
                                        <p className="text-lg text-gray-800">Correo Electrónico</p>
                                        <input
                                            type="text"
                                            placeholder="Escribe tu correo"
                                            className="w-full mb-2 mt-2 border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                )}

                            </div>

                            {/* Mobile */}
                            <div className="md:hidden mt-4">
                                <p className="text-lg text-gray-800">Talla:</p>
                                <Select onValueChange={(value) => handleSizeClick(value)} required>
                                    <SelectTrigger className="w-full border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200">
                                        <SelectValue placeholder="Selecciona tu talla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sizes.map(({ size, stock }) => (
                                            <SelectItem key={size} value={size} disabled={stock === 0}>
                                                <span className={stock === 0 ? "line-through text-gray-500" : ""}>
                                                    {size} {stock === 0 ? "Agotado" : ""}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>
                            </div>

                            <div className="mt-4">
                                <AccordionComponent product={product} />
                            </div>

                            {/* Comprar ahora */}
                            <div className="flex space-x-3 mt-10 w-full">
                                {!isMaquila ? (
                                    <div>
                                        <button
                                            className={`w-full border px-4 py-2 transition-colors duration-300
                                                ${isEmailValid
                                                    ? "bg-black border-black text-white hover:bg-cs-verde-musgo hover:text-white"
                                                    : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            onClick={async () => {
                                                if (!isEmailValid) return;

                                                try {
                                                    await saveMaquilaLead();
                                                    notify()
                                                } catch {
                                                    alert("Hubo un error. Intenta de nuevo.");
                                                }
                                            }}

                                        >
                                            Contáctanos
                                        </button>
                                        <ToastContainer position="top-center"
                                            autoClose={5000}
                                            hideProgressBar={true}
                                            newestOnTop={false}
                                            closeOnClick={true}
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                            pauseOnHover
                                            theme="dark"
                                        />
                                    </div>
                                ) : (
                                    <Link
                                        href={{
                                            pathname: `/catalogo/comprar/${product.id}`,
                                            query: { variantId: selectedVariant?.id, text: personalizedText },
                                        }}
                                    >
                                        <button className="bg-black border border-black hover:bg-cs-verde-musgo text-white hover:text-white transition-colors duration-300 px-4 py-2">
                                            Comprar ahora
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
