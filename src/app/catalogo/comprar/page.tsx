"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import ClientForm from "@/components/shop/buy/ClientForm";
import Header from "@/components/shop/buy/Header";
import Summary from "@/components/shop/buy/Summary";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart } = useCart();

    const [metodoEnvio, setMetodoEnvio] = useState<string>("estandar");
    const [shippingRates, setShippingRates] = useState({
        estandar: { precio: 0, rate_id: "", nombre: "Cargando..." },
        express: { precio: 0, rate_id: "", nombre: "Cargando..." }
    });

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
                <p className="text-[11px] text-cs-gris-grafito tracking-wide">Tu carrito está vacío</p>
                <Link
                    href="/catalogo"
                    className="text-[8px] uppercase tracking-[0.45em] text-cs-negro hover:text-cs-vino transition-colors duration-400 flex items-center gap-3"
                >
                    Explorar catálogo
                    <span className="inline-block w-6 h-px bg-current" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white px-6 md:px-16 pt-24 pb-24">
            <div className="max-w-6xl mx-auto">
                <Header />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <ClientForm
                        cart={cart}
                        metodoEnvio={metodoEnvio}
                        setMetodoEnvio={setMetodoEnvio}
                        onRatesUpdate={setShippingRates}
                    />
                    <Summary
                        cart={cart}
                        metodoEnvio={metodoEnvio}
                        shippingRates={shippingRates}
                    />
                </div>
            </div>
        </div>
    );
}
