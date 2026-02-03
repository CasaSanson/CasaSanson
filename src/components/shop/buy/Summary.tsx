"use client";
import React from "react";
import Image from "next/image";

interface SummaryProps {
    cart: any[]; // Luego puedes tiparlo correctamente con tu interfaz CartItem
    metodoEnvio: string;
    shippingRates: {
        estandar: { precio: number; nombre: string };
        express: { precio: number; nombre: string };
    };
}

export default function Summary({ cart, metodoEnvio, shippingRates }: SummaryProps) {
    // 1. Calcular Subtotal de todos los productos
    const subtotal = cart.reduce((acc, item) => {
        const precio =  item.base_price;
        return acc + (precio * item.quantity);
    }, 0);

    // 2. Obtener el precio de envío seleccionado
    const costoEnvio = metodoEnvio === "express" 
        ? shippingRates.express.precio 
        : shippingRates.estandar.precio;

    const total = subtotal + costoEnvio;

    return (
        <div className="bg-cs-vino p-6  sticky top-24">
            <h2 className="text-xl text-white font-bold mb-6 uppercase tracking-wider ">Resumen de compra</h2>
            
            {/* LISTA DE PRODUCTOS */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
                {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center gap-4 mt-2">
                            <div className="relative w-16 h-20 bg-gray-200 rounded">
                                <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover rounded" 
                                />
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {item.quantity}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-white font-bold uppercase">{item.name}</p>
                                <p className="text-xs text-gray-200">Talla: {item.selectedVariant.size}</p>
                                {item.personalizedText && (
                                    <p className="text-[10px] italic text-cs-verde-musgo">"{item.personalizedText}"</p>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-white font-medium">
                            ${(item.base_price) * item.quantity}
                        </p>
                    </div>
                ))}
            </div>

            {/* DESGLOSE DE COSTOS */}
            <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-200">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                    <span>Envío ({metodoEnvio === "express" ? "Express" : "Estándar"})</span>
                    <span>{costoEnvio === 0 ? "Ingresa tu código postal..." : `$${costoEnvio}`}</span>
                </div>
                <div className="flex text-white justify-between text-xl font-bold pt-4 border-t border-black">
                    <span >Total</span>
                    <span>${total}</span>
                </div>
            </div>
        </div>
    );
}