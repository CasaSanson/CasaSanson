"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext"; // <--- Importamos el carrito
import ClientForm from "@/components/shop/buy/ClientForm";
import Header from "@/components/shop/buy/Header";
import Summary from "@/components/shop/buy/Summary";

export default function CheckoutPage() {
    const { cart, totalItems } = useCart(); // <--- Accedemos a los productos guardados
    
    const [metodoEnvio, setMetodoEnvio] = useState<string>("estandar");
    const [shippingRates, setShippingRates] = useState({
        estandar: { precio: 0, rate_id: "", nombre: "Cargando..." },
        express: { precio: 0, rate_id: "", nombre: "Cargando..." }
    });

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <p className="mb-4">Tu carrito está vacío</p>
                <button onClick={() => window.location.href='/catalogo'} className="border border-black px-4 py-2">
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[8%]">
            <div className="container mx-auto max-w-6xl">
                <Header />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* COLUMNA IZQUIERDA */}
                    <ClientForm
                        cart={cart} // <--- Pasas todo el carrito
                        metodoEnvio={metodoEnvio}
                        setMetodoEnvio={setMetodoEnvio}
                        onRatesUpdate={setShippingRates}
                    />

                    {/* COLUMNA DERECHA */}
                    <Summary
                        cart={cart} // <--- Pasas todo el carrito
                        metodoEnvio={metodoEnvio}
                        shippingRates={shippingRates}
                    />
                </div>
            </div>
        </div>
    );
}