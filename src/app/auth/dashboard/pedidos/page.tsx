'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth')
      return
    }

    const fetchOrders = async () => {
      try {
        // Consultamos ambas tablas
        const [
          { data: paidOrders, error: paidError },
          { data: allOrders, error: allOrdersError },
        ] = await Promise.all([
          supabase.from('CS_ORDERS_PAID').select('*'),
          supabase.from('CS_ORDERS').select('*'),
        ])

        if (paidError || allOrdersError) throw paidError || allOrdersError

        // Unir registros por el mismo id
        const merged = (paidOrders || []).map((paid) => {
          const orderInfo = allOrders?.find((o) => o.id === paid.id)
          return {
            ...paid,       // nombre, apellido, status, created_at
            ...orderInfo,  // producto, talla, precio, cantidad, etc.
          }
        })

        // Ordenar por fecha más reciente
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
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <main className="bg-blue-500 min-h-screen w-full mt-[10%] mx-auto p-8">
        <p>Cargando...</p>
      </main>
    )
  }

  if (!session) return null

  return (
    <main className="bg-white min-h-screen w-full mx-auto p-8 md:w-[80%]">
      <h1 className="text-5xl  mb-4 text-center">Nuestros Pedidos</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p>No hay pedidos pagados</p>
      ) : (
        <div className="space-y-4 grid grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border shadow-lg rounded-lg shadow-gray-300 border-green-500 border-2 p-4 rounded">
              <h2 className="text-3xl">
                {order.name} {order.last_name}
              </h2>
              <p className="text-2xl">Estado: {order.status}</p>
              <p className="text-2xl">
                Fecha de pago: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <div className=" gap-4">
              <p className="text-lg mb-2">Producto: {order.product_name}</p>
              <p className="text-lg mb-2">Precio: {order.product_price}</p>
              <p className="text-lg mb-2">Cantidad: {order.quantity}</p>
              <p className="text-lg mb-2">Talla: {order.size}</p>
              <p className="text-lg mb-2">Personalizado: {order.personalized}</p>
              <p className="text-lg mb-2">ID de pedido: {order.id}</p>
              <p className="text-lg mb-2">Mail: {order.customer_email}</p>
              <p className="text-lg mb-2">Teléfono: {order.customer_telefono}</p>
              <p className="text-lg mb-2">Dirección: {order.direccion}</p>
              <p className="text-lg mb-2">Ciudad: {order.ciudad}</p>
              <p className="text-lg mb-2">Código Postal: {order.codigo_postal}</p>
              <p className="text-lg mb-2">País: {order.pais}</p>
              <p className="text-lg mb-2">Método de envío: {order.metodo_envio}</p>
              <p className="text-lg mb-2">Costo de envío: {order.costo_envio}</p>
              <p className="text-lg mb-2">Subtotal: {order.subtotal}</p>
              <p className="text-lg mb-2">Total: ${order.total}</p>
            </div>
            </div>
           
          ))}
        </div>
      )}
    </main>
  )
}
