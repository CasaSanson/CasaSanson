'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ClientForm from "@/components/shop/buy/ClientForm";
import Header from "@/components/shop/buy/Header";
import { supabase } from "@/lib/supabase";
import { Product, ProductVariant } from "@/lib/shop/interfaces";
import Summary from "@/components/shop/buy/Summary";

interface CompraPageProps {
    params: {
        id: string;
    };
}

export default function CompraPage({ params: routeParams }: CompraPageProps) {
    const searchParams = useSearchParams();
    const textParam = searchParams.get("text") || "";

    const { id } = routeParams;

    // --- ESTADOS DE LA PÁGINA ---
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [personalizedText, setPersonalizedText] = useState(textParam);
    
    // Estados compartidos para el envío
    const [metodoEnvio, setMetodoEnvio] = useState<string>("estandar");
    const [shippingRates, setShippingRates] = useState({
        estandar: { precio: 150, rate_id: "" },
        express: { precio: 250, rate_id: "" }
    });

    // --- EFECTOS ---

    // 1. Actualizar texto personalizado desde la URL
    useEffect(() => {
        if (textParam) setPersonalizedText(textParam);
    }, [textParam]);

    // 2. Cargar producto y variante inicial desde Supabase
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
                // Seleccionamos la primera variante disponible con stock
                const firstAvailable = data.product_variants.find((v: ProductVariant) => v.stock > 0);
                if (firstAvailable) setSelectedVariant(firstAvailable);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    // --- RENDERIZADO CONDICIONAL ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <p className="font-bold">Producto no encontrado</p>
        </div>
    );

    // Creamos un objeto de variante que incluya el texto personalizado para el resumen
    const variantWithText = selectedVariant
        ? { ...selectedVariant, personalizedText }
        : null;

    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[8%]">
            <div className="container mx-auto max-w-6xl">
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* COLUMNA IZQUIERDA: Formulario de cliente
                        - Captura datos y maneja la lógica de Skydropx
                    */}
                    <ClientForm
                        product={product}
                        quantity={quantity}
                        selectedVariant={selectedVariant}
                        metodoEnvio={metodoEnvio}
                        setMetodoEnvio={setMetodoEnvio}
                        onRatesUpdate={setShippingRates} // Actualiza los costos en esta página
                    />

                    {/* COLUMNA DERECHA: Resumen de compra
                        - Muestra el desglose de precios actualizado en tiempo real
                    */}
                    <Summary
                        product={product}
                        selectedVariant={variantWithText}
                        quantity={quantity}
                        metodoEnvio={metodoEnvio}
                        shippingRates={shippingRates} // Recibe los costos dinámicos
                    />
                </div>
            </div>
        </div>
    );
}