"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/shop/interfaces";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_variants (*)`)
        .eq("active", true);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useGSAP(
    () => {
      if (!loading && gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 36,
          opacity: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        });
      }
    },
    { scope: sectionRef, dependencies: [loading] }
  );

  if (loading) {
    return (
      <section className="w-full min-h-screen bg-white flex items-center justify-center pt-24">
        <p className="text-[9px] uppercase tracking-[0.45em] text-cs-gris-ceniza">
          Cargando colección...
        </p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full bg-white pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-4">
            Primavera · Verano 2026
          </p>
          <h1 className="font-kugile font-light text-5xl md:text-6xl text-cs-negro leading-none">
            Catálogo
          </h1>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
          {products.map((product) => {
            const totalStock = product.product_variants?.reduce(
              (acc, variant) => acc + (variant.stock || 0), 0
            ) || 0;
            const isAgotado = totalStock === 0;

            return (
              <div key={product.id} className="flex flex-col group">
                <Link
                  href={`/catalogo/ver/${product.id}`}
                  className={`block overflow-hidden relative ${isAgotado ? "pointer-events-none" : ""}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-[420px] object-cover transition-opacity duration-700 group-hover:opacity-85 ${isAgotado ? "grayscale brightness-110" : ""}`}
                  />
                  {isAgotado && (
                    <div className="absolute inset-0 flex items-end pb-5 px-5">
                      <span className="text-[8px] uppercase tracking-[0.4em] text-white/80">
                        Agotado
                      </span>
                    </div>
                  )}
                </Link>

                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-cs-negro leading-snug">
                      {product.name}
                    </p>
                    <p className="text-[9px] text-cs-gris-grafito mt-1 tracking-wide">
                      ${product.base_price} MXN
                    </p>
                  </div>
                  {!isAgotado && (
                    <Link
                      href={`/catalogo/ver/${product.id}`}
                      className="text-[8px] uppercase tracking-[0.35em] text-cs-negro/40 hover:text-cs-negro transition-colors duration-400 flex items-center gap-2 mt-0.5"
                    >
                      Ver <span className="inline-block w-4 h-px bg-current" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
