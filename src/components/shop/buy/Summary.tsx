"use client";
import Image from "next/image";
import { Product } from "@/lib/shop/interfaces";

// Definimos la estructura del objeto que viene del API
interface ShippingRate {
  precio: number;
  nombre: string;
  rate_id: string;
}

interface SummaryProps {
  product: Product;
  selectedVariant: any; 
  quantity: number;
  metodoEnvio: string;
  // CORRECCIÓN: Ahora son objetos, no números
  shippingRates: {
    estandar: ShippingRate;
    express: ShippingRate;
  };
}

export default function Summary({
  product,
  selectedVariant,
  quantity,
  metodoEnvio,
  shippingRates,
}: SummaryProps) {
  const precioNumerico = selectedVariant?.price || product.base_price;
  const subtotal = precioNumerico * quantity;
  
  // CORRECCIÓN: Accedemos a .precio para evitar el error [object Object]
  const envioCosto = 
    metodoEnvio === "express" 
      ? (shippingRates.express?.precio || 0) 
      : metodoEnvio === "estandar" 
        ? (shippingRates.estandar?.precio || 0) 
        : 0;

  const total = subtotal + envioCosto;

  return (
    <div className="bg-white p-6 shadow-lg border border-gray-900 h-fit sticky top-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-tight">
        Resumen del pedido
      </h2>

      {/* Información del Producto */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0 border border-gray-200">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover" 
            sizes="96px"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-black uppercase text-sm leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Talla: <span className="font-medium text-black">{selectedVariant?.size || "Única"}</span>
          </p>
          {selectedVariant?.personalizedText && (
            <div className="mt-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Personalización:</span>
              <p className="text-gray-800 text-sm italic leading-none">
                "{selectedVariant.personalizedText}"
              </p>
            </div>
          )}
          <p className="text-gray-600 text-sm mt-1">
            Cantidad: <span className="text-black">{quantity}</span>
          </p>
        </div>
      </div>

      {/* Desglose de Precios */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex justify-between text-black text-sm">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toLocaleString()} MXN</span>
        </div>

        <div className="flex justify-between text-black text-sm">
          <span className="flex items-center">
            Envío {metodoEnvio === 'express' ? '(Express)' : '(Estándar)'}
          </span>
          <span className="font-medium">
            {/* CORRECCIÓN: Mostramos el precio formateado */}
            {envioCosto > 0 ? `$${envioCosto.toLocaleString()} MXN` : '--'}
          </span>
        </div>

        {/* Total Final */}
        <div className="border-t border-gray-900 pt-3 flex justify-between font-bold text-xl text-black">
          <span>Total</span>
          <div className="text-right">
            <span>${total.toLocaleString()} MXN</span>
            <p className="text-[10px] font-normal text-gray-500 uppercase tracking-widest">
              IVA Incluido
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes informativos */}
      <div className="mt-6 space-y-2">
        {metodoEnvio === 'express' ? (
          <div className="bg-blue-50 p-3 rounded border border-blue-100">
            <p className="text-[11px] text-blue-700 leading-tight">
              <span className="font-bold uppercase mr-1">Prioridad DHL:</span> 
              Tu paquete será entregado en un periodo de 24 a 48 horas hábiles una vez procesado.
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
            Tiempo estimado de entrega: 3 a 5 días hábiles.
          </p>
        )}
      </div>
    </div>
  );
}