'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic'

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSession(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[9px] uppercase tracking-[0.45em] text-cs-gris-ceniza animate-pulse">
          Verificando tu compra...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-16 pt-32 pb-24">
      <div className="max-w-2xl mx-auto">

        <div className="flex flex-col items-center text-center mb-16">
          <Image
            src="/sanson_black.png"
            alt="Casa Sansón"
            width={100}
            height={28}
            className="object-contain opacity-80 mb-12"
          />
          <div className="w-px h-12 bg-cs-negro/15 mb-12" />
          <p className="text-[8px] uppercase tracking-[0.55em] text-cs-gris-ceniza mb-6">
            Pedido confirmado
          </p>
          <h1 className="font-kugile font-light text-4xl md:text-5xl text-cs-negro leading-tight mb-5">
            Gracias por tu compra.
          </h1>
          <p className="text-[11px] text-cs-gris-grafito tracking-wide leading-relaxed max-w-sm">
            Hemos recibido tu pedido y lo procesaremos a la brevedad.
            Recibirás una confirmación en tu correo electrónico.
          </p>
        </div>

        {session && (
          <div className="border-t border-cs-negro/10 pt-10 mb-14">
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-8">
              Resumen del pedido
            </p>
            <div className="space-y-4 text-[11px] text-cs-gris-grafito tracking-wide">
              <div className="flex justify-between border-b border-cs-negro/8 pb-3">
                <span>ID de pedido</span>
                <span className="text-cs-negro">{session.metadata?.orderId || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-cs-negro/8 pb-3">
                <span>Estado</span>
                <span className="text-cs-negro uppercase tracking-wider text-[9px]">{session.payment_status}</span>
              </div>
              <div className="flex justify-between border-b border-cs-negro/8 pb-3">
                <span>Email</span>
                <span className="text-cs-negro">{session.customer_details?.email || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-cs-negro/8 pb-3">
                <span>Método de envío</span>
                <span className="text-cs-negro">{session.metadata?.shippingMethod || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-cs-negro/8 pb-3">
                <span>Dirección</span>
                <span className="text-cs-negro text-right max-w-[50%]">
                  {session.metadata?.address}, {session.metadata?.city}, {session.metadata?.postalCode}
                </span>
              </div>
              {session.line_items?.data?.map((item: any) => (
                <div key={item.id} className="flex justify-between border-b border-cs-negro/8 pb-3">
                  <span>{item.description} × {item.quantity}</span>
                  <span className="text-cs-negro">${(item.amount_subtotal / 100).toFixed(2)} MXN</span>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="text-[9px] uppercase tracking-[0.35em] text-cs-negro">Total pagado</span>
                <span className="font-kugile font-light text-xl text-cs-negro">
                  ${(session.amount_total / 100).toFixed(2)} MXN
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="text-[9px] uppercase tracking-[0.45em] text-white bg-cs-negro hover:bg-cs-vino transition-colors duration-400 py-4 px-10 text-center"
          >
            Seguir explorando
          </Link>
          <Link
            href="/"
            className="text-[9px] uppercase tracking-[0.45em] text-cs-negro border border-cs-negro/20 hover:border-cs-negro transition-colors duration-400 py-4 px-10 text-center"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[9px] uppercase tracking-[0.45em] text-cs-gris-ceniza animate-pulse">
          Cargando...
        </p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
