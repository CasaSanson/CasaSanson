"use client";
import React from "react";
import Image from "next/image";

interface SummaryProps {
    cart: any[];
    metodoEnvio: string;
    shippingRates: {
        estandar: { precio: number; nombre: string };
        express: { precio: number; nombre: string };
    };
}

export default function Summary({ cart, metodoEnvio, shippingRates }: SummaryProps) {
    const subtotal = cart.reduce((acc, item) => {
        return acc + (item.base_price * item.quantity);
    }, 0);

    const costoEnvio = metodoEnvio === "express"
        ? shippingRates.express.precio
        : shippingRates.estandar.precio;

    const total = subtotal + costoEnvio;

    return (
        <div className="bg-cs-negro p-8 sticky top-24">
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-ivory/40 mb-8">
                Tu selección
            </p>

            {/* Productos */}
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-1">
                {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-white/[0.06] pb-6">
                        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-white/5">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cs-vino flex items-center justify-center text-[8px] text-white">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-cs-ivory leading-snug">
                                    {item.name}
                                </p>
                                <p className="text-[9px] text-cs-ivory/40 mt-1 uppercase tracking-[0.15em]">
                                    Talla {item.selectedVariant.size}
                                </p>
                                {item.personalizedText && (
                                    <p className="text-[9px] italic text-cs-ivory/50 mt-1">
                                        &ldquo;{item.personalizedText}&rdquo;
                                    </p>
                                )}
                            </div>
                            <p className="text-[11px] text-cs-ivory tracking-wide">
                                ${(item.base_price * item.quantity).toLocaleString("es-MX")} MXN
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desglose */}
            <div className="space-y-3 border-t border-white/[0.08] pt-6">
                <div className="flex justify-between text-[10px] text-cs-ivory/50 tracking-wide">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-[10px] text-cs-ivory/50 tracking-wide">
                    <span>Envío ({metodoEnvio === "express" ? "Express" : "Estándar"})</span>
                    <span>
                        {costoEnvio === 0
                            ? "Ingresa tu código postal"
                            : `$${costoEnvio.toLocaleString("es-MX")}`}
                    </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/[0.08]">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-cs-ivory/70">Total</span>
                    <span className="font-kugile font-light text-2xl text-cs-ivory tracking-tight">
                        ${total.toLocaleString("es-MX")}
                    </span>
                </div>
            </div>
        </div>
    );
}
