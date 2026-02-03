"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckoutRedirection = () => {
    setIsCartOpen(false);
    router.push("/catalogo/comprar");
  };

  const subtotal = cart.reduce((acc, item) => 
    acc + (item.base_price) * item.quantity, 0
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 transition-opacity z-[60] ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-cs-vino z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full flex flex-col text-white">
          <div className="flex justify-between items-center border-b border-white/20 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">Tu Selección</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-3xl font-thin hover:scale-110 transition-transform">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                 <p className="text-center text-gray-300 italic">El carrito está esperando tu elección</p>
                 <button onClick={() => setIsCartOpen(false)} className="text-xs border border-white px-4 py-2 uppercase tracking-widest hover:bg-white hover:text-cs-verde-musgo transition">Volver a la tienda</button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.selectedVariant.id}-${index}`} className="flex gap-4 mb-8 border-b border-white/10 pb-6 last:border-0">
                  <div className="relative w-28 h-36 bg-white/10 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold uppercase tracking-tighter text-lg leading-tight">{item.name}</p>
                      <p className="text-gray-300 text-sm mt-1 uppercase tracking-wider">Talla: {item.selectedVariant.size}</p>
                      
                      {/* SELECTOR DE CANTIDAD [+] [-] */}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">Pzas:</span>
                        <div className="flex items-center border border-white/30 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.selectedVariant.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-white/10 rounded-l-full transition"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.selectedVariant.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-white/10 rounded-r-full transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {item.personalizedText && (
                        <p className="text-[10px] text-cs-verde-musgo bg-white px-2 py-1 mt-3 italic inline-block rounded-sm">
                          "{item.personalizedText}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                       <p className="font-bold text-lg">
                          ${(item.base_price) * item.quantity}
                       </p>
                       <button 
                         onClick={() => removeFromCart(item.selectedVariant.id)} 
                         className="text-[11px] uppercase text-red-400 font-bold hover:text-red-300 transition-colors tracking-widest"
                       >
                         Eliminar
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-white/20 pt-6 space-y-4">
              <div className="flex justify-between items-center px-2">
                 <span className="text-xs uppercase text-gray-300 tracking-[0.2em]">Subtotal</span>
                 <span className="text-2xl font-bold tracking-tighter">
                    ${subtotal}
                 </span>
              </div>
              
              <button 
                onClick={handleCheckoutRedirection}
                className="w-full bg-black text-white py-5 hover:bg-white hover:text-black transition-all duration-500 uppercase text-xs tracking-[0.4em] font-bold shadow-lg"
              >
                Finalizar Compra
              </button>
              <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest opacity-70">Impuestos y envío calculados al pagar</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}