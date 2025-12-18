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
    const [metodoEnvio, setMetodoEnvio] = useState<string>("estandar");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [personalizedText, setPersonalizedText] = useState(textParam);
    const [quantity, setQuantity] = useState<number>(1); // Definimos quantity

    // Actualizamos personalizedText desde query
    useEffect(() => {
        if (textParam) setPersonalizedText(textParam);
    }, [textParam]);

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
                // Selecciona la primera variante con stock > 0
                const firstAvailable = data.product_variants.find((v: ProductVariant) => v.stock > 0);
                if (firstAvailable) setSelectedVariant(firstAvailable);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Cargando producto...</p>;
    if (!product) return <p>Producto no encontrado</p>;

    // Creamos una variante con personalizedText para pasar a Summary
    const variantWithText = selectedVariant
        ? { ...selectedVariant, personalizedText }
        : null;

    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[8%]">
            <div className="container mx-auto max-w-6xl">
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de compra */}
                    <ClientForm
                        product={product}
                        quantity={quantity}
                        selectedVariant={selectedVariant}
                        setSelectedVariant={setSelectedVariant}
                        personalizedText={personalizedText}
                        setPersonalizedText={setPersonalizedText}
                    />

                    {/* Summary con variante que incluye personalizedText */}
                    <Summary
                        product={product}
                        selectedVariant={variantWithText}
                        quantity={quantity}
                        metodoEnvio={metodoEnvio}
                    />
                </div>
            </div>
        </div>
    );
}
