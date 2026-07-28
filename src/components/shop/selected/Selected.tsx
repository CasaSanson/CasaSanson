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
import { useCart } from "@/context/CartContext";


export default function Selected({ params }: { params: { id: string } }) {
    const { addToCart, setIsCartOpen } = useCart();
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
                const firstAvailable = data.product_variants.find((v: ProductVariant) => v.stock > 0);
                if (firstAvailable) setSelectedSize(firstAvailable.size);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-[9px] uppercase tracking-[0.45em] text-cs-gris-ceniza">Cargando...</p>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-[9px] uppercase tracking-[0.45em] text-cs-gris-ceniza">Producto no encontrado</p>
            </div>
        );
    }

    const sizes = product.product_variants.map((v) => ({
        size: v.size,
        stock: v.stock,
    }));

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart({
            ...product,
            selectedVariant: selectedVariant,
            personalizedText: personalizedText,
            quantity: 1
        });
        setIsCartOpen(true);
    };

    const selectedVariant = product.product_variants.find((v) => v.size === selectedSize);
    const displayPrice = product.base_price;
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
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-24">

                {/* Breadcrumb */}
                <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-cs-gris-ceniza hover:text-cs-negro transition-colors duration-400 mb-14"
                >
                    <span className="inline-block w-4 h-px bg-current" />
                    Catálogo
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">

                    {/* Imagen principal — 7 cols */}
                    <div className="md:col-span-7 relative overflow-hidden cursor-zoom-in"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMousePosition({
                                x: ((e.clientX - rect.left) / rect.width) * 100,
                                y: ((e.clientY - rect.top) / rect.height) * 100,
                            });
                        }}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={900}
                            height={1100}
                            className={`w-full h-auto transition-transform duration-500 ${isZoomed ? "scale-125" : "scale-100"}`}
                            style={{ transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }}
                        />
                    </div>

                    {/* Info — 5 cols */}
                    <div className="md:col-span-5 flex flex-col gap-8 md:pt-4">

                        {/* Nombre y precio */}
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-4">
                                Casa Sansón
                            </p>
                            <h1 className="font-kugile font-light text-3xl md:text-4xl text-cs-negro leading-tight mb-3">
                                {product.name}
                            </h1>
                            <p className="text-[12px] text-cs-gris-grafito tracking-wide">
                                ${displayPrice} MXN
                            </p>
                        </div>

                        {/* Interior / Personalización preview */}
                        {isPersonalizado && (
                            <div className="relative overflow-hidden">
                                <img
                                    src="/interior_verde.png"
                                    alt="Interior"
                                    className="w-full h-48 object-cover"
                                />
                                {personalizedText && (
                                    <p
                                        className="absolute text-cs-negro text-base"
                                        style={{
                                            top: "50%", left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontFamily: "Times New Roman",
                                        }}
                                    >
                                        {personalizedText}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tallas — desktop */}
                        {isMaquila && (
                            <div className="hidden md:block">
                                <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-4">
                                    Talla
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(({ size, stock }) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeClick(size)}
                                            disabled={stock === 0}
                                            className={`border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                                                selectedSize === size
                                                    ? "bg-cs-negro border-cs-negro text-white"
                                                    : stock > 0
                                                        ? "border-cs-negro/20 text-cs-negro hover:border-cs-negro"
                                                        : "border-cs-negro/10 text-cs-gris-ceniza cursor-not-allowed"
                                            }`}
                                        >
                                            <span className={stock === 0 ? "line-through opacity-40" : ""}>
                                                {size}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Maquila — sin stock */}
                        {!isMaquila && (
                            <p className="text-[11px] text-cs-gris-grafito leading-relaxed">
                                Este producto es solo bajo pedido. Comparte tu correo y te contactamos.
                            </p>
                        )}

                        {/* Tallas — mobile */}
                        {isMaquila && (
                            <div className="md:hidden">
                                <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-3">
                                    Talla
                                </p>
                                <Select onValueChange={(value) => handleSizeClick(value)} required>
                                    <SelectTrigger className="w-full border border-cs-negro/20 px-4 py-3 text-[11px] bg-white focus:outline-none focus:border-cs-negro transition-colors duration-300 rounded-none">
                                        <SelectValue placeholder="Selecciona tu talla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sizes.map(({ size, stock }) => (
                                            <SelectItem key={size} value={size} disabled={stock === 0}>
                                                <span className={stock === 0 ? "line-through text-cs-gris-ceniza" : ""}>
                                                    {size} {stock === 0 ? "— Agotado" : ""}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Input personalización o email */}
                        <div>
                            {isPersonalizado ? (
                                <>
                                    <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-3">
                                        Personalización
                                    </p>
                                    <div className="border-b border-cs-negro/20 focus-within:border-cs-negro transition-colors duration-400">
                                        <input
                                            type="text"
                                            placeholder="Hazlo tuyo"
                                            className="w-full py-3 bg-transparent text-[12px] text-cs-negro placeholder:text-cs-gris-ceniza/50 outline-none tracking-wide"
                                            value={personalizedText}
                                            onChange={(e) => setPersonalizedText(e.target.value)}
                                            maxLength={9}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-3">
                                        Correo electrónico
                                    </p>
                                    <div className="border-b border-cs-negro/20 focus-within:border-cs-negro transition-colors duration-400">
                                        <input
                                            type="email"
                                            placeholder="tucorreo@gmail.com"
                                            className="w-full py-3 bg-transparent text-[12px] text-cs-negro placeholder:text-cs-gris-ceniza/50 outline-none tracking-wide"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            maxLength={100}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Acordeón */}
                        <div>
                            <AccordionComponent product={product} />
                        </div>

                        {/* CTA */}
                        <div>
                            {!isMaquila ? (
                                <>
                                    <button
                                        className={`w-full py-4 text-[9px] uppercase tracking-[0.45em] transition-colors duration-400 ${
                                            isEmailValid
                                                ? "bg-cs-negro text-white hover:bg-cs-vino"
                                                : "bg-cs-negro/10 text-cs-gris-ceniza cursor-not-allowed"
                                        }`}
                                        onClick={async () => {
                                            if (!isEmailValid) return;
                                            try {
                                                await saveMaquilaLead();
                                                notify();
                                            } catch {
                                                toast.error("Hubo un error. Intenta de nuevo.");
                                            }
                                        }}
                                    >
                                        Contáctanos
                                    </button>
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={5000}
                                        hideProgressBar
                                        closeOnClick
                                        theme="dark"
                                    />
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!selectedVariant) {
                                            toast.error("Por favor, selecciona una talla");
                                            return;
                                        }
                                        addToCart({
                                            ...product,
                                            selectedVariant,
                                            personalizedText,
                                            quantity: 1
                                        });
                                        setIsCartOpen(true);
                                        toast.success("¡Añadido al carrito!");
                                    }}
                                    className="w-full py-4 text-[9px] uppercase tracking-[0.45em] bg-cs-negro text-white hover:bg-cs-vino transition-colors duration-400"
                                >
                                    Añadir al carrito
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
