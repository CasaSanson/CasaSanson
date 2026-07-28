"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalItems } = useCart();
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => {
    const precio = item.selectedVariant.price ?? item.base_price ?? 0;
    return acc + precio * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center gap-8 px-6">
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
          <ShoppingBag size={26} strokeWidth={1} className="text-cs-ivory/30" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-serif text-cs-ivory/80 text-xl tracking-wide">
            Tu carrito está vacío
          </h2>
          <p className="text-[11px] text-cs-ivory/30 uppercase tracking-[0.25em]">
            Aún no has elegido ninguna pieza
          </p>
        </div>
        <Link
          href="/catalogo"
          className="flex items-center gap-2 text-[10px] border border-white/15 px-8 py-3 uppercase tracking-[0.3em] text-cs-ivory/60 hover:border-white/40 hover:text-cs-ivory transition-all duration-300"
        >
          Explorar colección
          <ArrowRight size={12} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-cs-ivory pt-24 pb-20">
      <div className="container mx-auto px-5 max-w-5xl">

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] text-cs-ivory/30 uppercase tracking-[0.25em] mb-5">
            <Link href="/catalogo" className="hover:text-cs-ivory/60 transition-colors">
              Catálogo
            </Link>
            <ChevronRight size={10} strokeWidth={1.5} />
            <span>Tu selección</span>
          </div>
          <div className="flex items-end justify-between border-b border-white/[0.08] pb-5">
            <h1 className="font-serif text-2xl uppercase tracking-[0.1em] text-cs-ivory/90">
              Tu Selección
            </h1>
            <span className="text-[10px] text-cs-ivory/30 uppercase tracking-[0.2em]">
              {totalItems} {totalItems === 1 ? "pieza" : "piezas"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Product List */}
          <div className="space-y-0 divide-y divide-white/[0.06]">
            {cart.map((item) => {
              const precio = item.selectedVariant.price ?? item.base_price ?? 0;
              return (
                <div key={item.selectedVariant.id} className="flex gap-5 py-6 group">
                  {/* Image */}
                  <div className="relative w-[85px] h-[110px] flex-shrink-0 overflow-hidden bg-white/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-serif text-[14px] uppercase tracking-tight text-cs-ivory/90 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-cs-ivory/35 uppercase tracking-[0.2em] mt-1">
                          Talla {item.selectedVariant.size}
                        </p>
                        {item.personalizedText && (
                          <p className="text-[10px] text-cs-rosa-polvo/70 italic mt-2">
                            &ldquo;{item.personalizedText}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.selectedVariant.id)}
                        className="flex-shrink-0 text-cs-ivory/20 hover:text-cs-ivory/60 transition-colors duration-200 mt-0.5"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Qty controls */}
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.selectedVariant.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-cs-ivory/30 hover:text-cs-ivory hover:bg-white/5 transition-all duration-150 text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[12px] text-cs-ivory/70">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.selectedVariant.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-cs-ivory/30 hover:text-cs-ivory hover:bg-white/5 transition-all duration-150 text-sm"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-serif text-[16px] text-cs-ivory tracking-tight">
                        ${(precio * item.quantity).toLocaleString("es-MX")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="lg:sticky lg:top-24">
            <div className="border border-white/[0.08] bg-white/[0.025] p-6 space-y-5">
              <h2 className="font-serif text-[11px] uppercase tracking-[0.3em] text-cs-ivory/60 pb-4 border-b border-white/[0.06]">
                Resumen de compra
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-cs-ivory/40 uppercase tracking-widest text-[10px]">
                    Subtotal
                  </span>
                  <span className="text-cs-ivory/80">
                    ${subtotal.toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cs-ivory/40 uppercase tracking-widest text-[10px]">
                    Envío
                  </span>
                  <span className="text-[10px] text-cs-ivory/30 italic">
                    Calculado al pagar
                  </span>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-5 flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-[0.25em] text-cs-ivory/50">
                  Total estimado
                </span>
                <span className="font-serif text-[24px] text-cs-ivory tracking-tighter">
                  ${subtotal.toLocaleString("es-MX")}
                </span>
              </div>

              <button
                onClick={() => router.push("/catalogo/comprar")}
                className="w-full bg-cs-ivory text-cs-negro py-[14px] uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-cs-vino hover:text-cs-ivory transition-colors duration-500"
              >
                Finalizar pedido
              </button>

              <Link
                href="/catalogo"
                className="block text-center text-[9px] uppercase tracking-[0.25em] text-cs-ivory/25 hover:text-cs-ivory/50 transition-colors duration-200 pt-1"
              >
                Seguir explorando piezas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
