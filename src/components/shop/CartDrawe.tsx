"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckoutRedirection = () => {
    setIsCartOpen(false);
    router.push("/catalogo/comprar");
  };

  const subtotal = cart.reduce((acc, item) =>
    acc + item.base_price * item.quantity, 0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-all duration-500 z-[60] ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-[70] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-cs-negro" />

        <div className="relative h-full flex flex-col text-cs-ivory">
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <ShoppingBag size={15} strokeWidth={1.5} className="opacity-50" />
              <h2 className="font-serif text-[11px] uppercase tracking-[0.35em] text-cs-ivory/90">
                Tu Selección
              </h2>
              {totalItems > 0 && (
                <span className="w-[18px] h-[18px] rounded-full bg-cs-vino flex items-center justify-center text-[9px] font-bold text-cs-ivory">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-cs-ivory/40 hover:text-cs-ivory transition-colors duration-200"
            >
              <X size={17} strokeWidth={1.2} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-7 px-8 text-center">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
                  <ShoppingBag size={22} strokeWidth={1} className="opacity-20" />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-cs-ivory/80 text-sm tracking-wide">
                    Aún no has elegido nada
                  </p>
                  <p className="text-[10px] text-cs-ivory/30 tracking-[0.25em] uppercase">
                    Cada pieza tiene historia
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-[10px] border border-white/15 px-7 py-3 uppercase tracking-[0.25em] text-cs-ivory/60 hover:border-white/40 hover:text-cs-ivory transition-all duration-300"
                >
                  Explorar la colección
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {cart.map((item, index) => (
                  <div
                    key={`${item.selectedVariant.id}-${index}`}
                    className="flex gap-4 px-6 py-5 hover:bg-white/[0.015] transition-colors duration-200"
                  >
                    {/* Image */}
                    <div className="relative w-[68px] h-[88px] flex-shrink-0 overflow-hidden bg-white/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-serif text-[12px] uppercase tracking-tight text-cs-ivory leading-snug line-clamp-2 flex-1">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.selectedVariant.id)}
                            className="flex-shrink-0 text-cs-ivory/20 hover:text-cs-ivory/60 transition-colors duration-200 mt-0.5"
                          >
                            <Trash2 size={12} strokeWidth={1.5} />
                          </button>
                        </div>

                        <p className="text-[10px] text-cs-ivory/35 uppercase tracking-[0.2em] mt-1">
                          Talla {item.selectedVariant.size}
                        </p>

                        {item.personalizedText && (
                          <p className="text-[10px] text-cs-rosa-polvo/70 italic mt-2 leading-relaxed">
                            &ldquo;{item.personalizedText}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Bottom: qty + price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.selectedVariant.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-cs-ivory/40 hover:text-cs-ivory hover:bg-white/5 transition-all duration-150"
                          >
                            <Minus size={9} strokeWidth={2.5} />
                          </button>
                          <span className="w-7 text-center text-[11px] font-medium text-cs-ivory/80">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.selectedVariant.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-cs-ivory/40 hover:text-cs-ivory hover:bg-white/5 transition-all duration-150"
                          >
                            <Plus size={9} strokeWidth={2.5} />
                          </button>
                        </div>

                        <p className="text-[13px] font-medium text-cs-ivory tracking-tight">
                          ${(item.base_price * item.quantity).toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-white/[0.08] px-7 pt-5 pb-7 space-y-5 bg-black/30">
              {/* Subtotal row */}
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase tracking-[0.35em] text-cs-ivory/35">
                  Subtotal
                </span>
                <span className="font-serif text-[22px] font-light text-cs-ivory tracking-tighter">
                  ${subtotal.toLocaleString("es-MX")}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckoutRedirection}
                className="w-full bg-cs-ivory text-cs-negro py-[14px] uppercase text-[10px] tracking-[0.45em] font-bold hover:bg-cs-vino hover:text-cs-ivory transition-colors duration-500"
              >
                Finalizar Compra
              </button>

              <p className="text-[8px] text-center text-cs-ivory/20 uppercase tracking-[0.2em]">
                Envío e impuestos se calculan al pagar
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
