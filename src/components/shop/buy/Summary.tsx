"use client";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/shop/interfaces";

interface SummaryProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  metodoEnvio: string;
}

export default function Summary({
  product,
  selectedVariant,
  quantity,
  metodoEnvio,
}: SummaryProps) {
  const precioNumerico = selectedVariant?.price || product.base_price;
  const subtotal = precioNumerico * quantity;
  const envio = metodoEnvio === "express" ? 250 : metodoEnvio === "estandar" ? 150 : 0;
  const total = subtotal + envio;
  

  return (
    <div className="bg-white p-6  shadow-lg shadow-gray-300 h-fit border border-gray-900">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-40 h-40">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-xl text-gray-600">Talla: {selectedVariant?.size || "N/A"}</p>
          <p className="text-xl text-gray-600">Personalizado: {selectedVariant?.personalizedText || "N/A"}</p>
          <p className="text-xl text-gray-600">Cantidad: {quantity}</p>
          <p className="text-xl text-gray-600">Envío: {metodoEnvio}</p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between ">
          <span className="text-sm md:text-lg text-black">Subtotal:</span>
          <span className="text-sm md:text-lg text-black">${subtotal.toFixed(2)} MXN</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm md:text-lg text-black">Envío:</span>
          <span className="text-sm md:text-lg text-black">${envio.toFixed(2)} MXN</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between ">
            <span className="text-sm md:text-lg text-black"> Total:</span>
            <span className="text-black text-sm md:text-lg">${total.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
}