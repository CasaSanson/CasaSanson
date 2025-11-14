'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { retrieveCheckoutSession } from '@/lib/stripe';

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
        .catch(error => {
          console.error('Error fetching session:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando tu compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[2%]">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl text-gray-800 mb-2">¡Compra exitosa!</h1>
            <p className="text-gray-600">
              Gracias por tu compra. Hemos recibido tu pago y procesaremos tu pedido.
            </p>
          </div>

          {session && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">Resumen del pedido</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p><strong>ID de pedido:</strong> {session.metadata?.orderId || '—'}</p>
                  <p><strong>Estado pago:</strong> {session.payment_status}</p>
                  <p><strong>Email:</strong> {session.customer_details?.email || '—'}</p>
                  <p><strong>Teléfono:</strong> {session.metadata?.customerPhone || '—'}</p>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Cliente</h4>
                  <p>{session.metadata?.customerName || '—'}</p>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Envío</h4>
                  <p><strong>Método:</strong> {session.metadata?.shippingMethod || '—'}</p>
                  <p><strong>Dirección:</strong> {session.metadata?.address || '—'}</p>
                  <p><strong>Ciudad:</strong> {session.metadata?.city || '—'}</p>
                  <p><strong>Código Postal:</strong> {session.metadata?.postalCode || '—'}</p>
                  <p><strong>País:</strong> {session.metadata?.country || '—'}</p>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Artículos</h4>
                  <div className="space-y-1">
                    {session.line_items?.data?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.description} × {item.quantity}</span>
                        <span>${(item.amount_subtotal / 100).toFixed(2)} MXN</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total pagado</span>
                  <span>${(session.amount_total / 100).toFixed(2)} MXN</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
           

            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/catalogo" 
                className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors duration-200 text-center"
              >
                Seguir comprando
              </Link>
              <Link 
                href="/" 
                className="flex-1 bg-white border border-black text-black py-3 px-4 hover:bg-gray-800 transition-colors duration-200 text-center"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div><p className="text-gray-600">Cargando...</p></div></div>}>
      <SuccessContent />
    </Suspense>
  )
}