'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingBag, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [
          { data: paidOrders, error: paidError },
          { data: allOrders, error: allOrdersError },
        ] = await Promise.all([
          supabase.from('orders').select('*'),
          supabase.from('orders_item').select('*'),
        ])

        if (paidError || allOrdersError) throw paidError || allOrdersError

        const merged = (paidOrders || []).map((paid) => {
          const orderInfo = allOrders?.find((o) => o.id === paid.id)
          return { ...paid, ...orderInfo }
        })

        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setOrders(merged)
      } catch (err) {
        console.error(err)
        setError('Error al cargar los pedidos')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center">
        <Loader2 className="animate-spin text-white/20" size={24} />
      </div>
    )
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const statusColor = (s: string) => {
    if (!s) return "text-white/30"
    if (s.toLowerCase().includes("pagad") || s.toLowerCase().includes("complet")) return "text-cs-verde-musgo"
    if (s.toLowerCase().includes("cancel")) return "text-cs-vino/80"
    return "text-white/50"
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={13} strokeWidth={1.5} className="text-white/30" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">Operaciones</p>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl text-white/85">Pedidos</h1>
            <span className="text-[9px] bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 text-white/30 uppercase tracking-wider">
              {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-cs-vino/10 border border-cs-vino/25 mb-6 text-[11px] text-white/50">
            <AlertCircle size={13} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/[0.06]">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">No hay pedidos pagados</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {orders.map((order) => {
              const isOpen = expandedId === order.id
              return (
                <div key={order.id} className="hover:bg-white/[0.01] transition-colors">
                  {/* Row summary */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full flex items-center gap-4 py-4 px-2 text-left"
                  >
                    {/* Name + product */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3">
                        <p className="font-serif text-[13px] text-white/80">
                          {order.name} {order.last_name}
                        </p>
                        {order.product_name && (
                          <p className="text-[10px] text-white/35 truncate hidden sm:block">
                            {order.product_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[9px] text-white/25">
                          {new Date(order.created_at).toLocaleDateString("es-MX", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </p>
                        {order.status && (
                          <span className={`text-[9px] uppercase tracking-wider ${statusColor(order.status)}`}>
                            {order.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      {order.total && (
                        <p className="font-serif text-[15px] text-white/75">${order.total}</p>
                      )}
                    </div>

                    {/* Expand icon */}
                    <div className="text-white/20 ml-2 flex-shrink-0">
                      {isOpen ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-4 pb-6">
                      <div className="bg-white/[0.025] border border-white/[0.06] p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {[
                          ["Producto", order.product_name],
                          ["Precio unitario", order.product_price ? `$${order.product_price}` : null],
                          ["Cantidad", order.quantity],
                          ["Talla", order.size],
                          ["Personalización", order.personalized],
                          ["Subtotal", order.subtotal ? `$${order.subtotal}` : null],
                          ["Costo de envío", order.costo_envio ? `$${order.costo_envio}` : null],
                          ["Método de envío", order.metodo_envio],
                          ["Email", order.customer_email],
                          ["Teléfono", order.customer_telefono],
                          ["Dirección", order.direccion],
                          ["Ciudad", order.ciudad],
                          ["Código postal", order.codigo_postal],
                          ["País", order.pais],
                          ["ID de pedido", order.id],
                        ].map(([label, value]) =>
                          value ? (
                            <div key={label as string} className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-[0.25em] text-white/25">{label}</span>
                              <span className="text-[12px] text-white/65 mt-0.5 font-mono break-all">{value}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
