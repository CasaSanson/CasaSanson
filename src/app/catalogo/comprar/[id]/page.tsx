'use client'
import React, { useState, useEffect } from "react";
// Para catalogo/comprar/[id]/page.tsx
import ClientForm from "@/components/shop/buy/ClientForm";
import Header from "@/components/shop/buy/Header";
import Summary from "@/components/shop/buy/Summary";

export default function CompraPage() {        
    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[2%]">
            <div className="container mx-auto max-w-6xl">
                <Header/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de compra */}
                    <ClientForm/>
                    {/* Resumen del pedido */}
                    <Summary/>
                </div>
            </div>
        </div>
    );
}