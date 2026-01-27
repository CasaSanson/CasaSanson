"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importamos el router

export default function CarritoPage() {
  const { cart, removeFromCart, totalItems } = useCart();
  const router = useRouter(); // Inicializamos el router

  // Calcular el subtotal de forma segura
  const subtotal = cart.reduce((acc, item) => {
    const precio = item.selectedVariant.price ?? item.base_price ?? 0;
    return acc + (precio * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-light">Tu carrito está vacío</h2>
        <Link href="/catalogo" className="border border-black px-6 py-2 hover:bg-black hover:text-white transition">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <h1 className="text-3xl font-light mb-10 border-b pb-4 uppercase tracking-widest">Tu Selección</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lista de productos (Columna Izquierda) */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.selectedVariant.id} className="flex gap-4 border-b pb-6">
              <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-col justify-between w-full">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg uppercase font-medium">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.selectedVariant.id)}
                      className="text-gray-400 hover:text-red-800 text-xs uppercase tracking-tighter"
                    >
                      Quitar
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Talla: {item.selectedVariant.size}</p>
                  {item.personalizedText && (
                    <p className="text-sm italic text-cs-verde-musgo font-medium">
                      Personalización: "{item.personalizedText}"
                    </p>
                  )}
                  <p className="text-sm mt-2 text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-right font-semibold text-black">
                  ${(item.selectedVariant.price ?? item.base_price ?? 0) * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Compra (Columna Derecha / Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24 border border-gray-100 shadow-sm">
            <h2 className="text-xl mb-6 uppercase font-bold tracking-tight">Resumen</h2>
            <div className="space-y-4 border-b pb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} productos)</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Envío</span>
                <span className="italic">Calculado en el siguiente paso</span>
              </div>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold border-t border-black mt-4">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            
            {/* AQUÍ ESTÁ EL CAMBIO: El botón ahora redirige al Checkout */}
            <button 
              onClick={() => router.push("/catalogo/comprar")} 
              className="w-full bg-black text-white py-4 mt-4 hover:bg-cs-verde-musgo transition duration-300 uppercase font-bold tracking-widest text-xs"
            >
              Finalizar Pedido
            </button>
            
            <Link href="/catalogo" className="block text-center text-xs mt-6 underline uppercase text-gray-500 hover:text-black">
              Seguir explorando piezas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}