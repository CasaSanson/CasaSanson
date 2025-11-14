import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutSession } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await retrieveCheckoutSession(params.sessionId);

    // Si el pago está completado, registrar en tabla de confirmaciones
    const paymentStatus = session.payment_status;
    const orderId = (session.metadata as any)?.orderId as string | undefined;
    const productId = parseInt(((session.metadata as any)?.productId as string) || '0', 10);
    const qty = parseInt(((session.metadata as any)?.quantity as string) || '1', 10);
    if (paymentStatus === 'paid' && orderId) {
        // Primero obtener los datos del pedido para obtener nombre y apellido
        const { data: orderData, error: orderFetchError } = await supabaseAdmin
          .from('CS_ORDERS')
          .select('customer_nombre, customer_apellido')
          .eq('id', orderId)
          .single();
  
        if (orderFetchError) {
          console.error('Error fetching order data:', orderFetchError);
        } else if (orderData) {
         // Insertar/asegurar registro en la tabla 'CS_ORDERS_PAID' con todos los campos requeridos
         const { error } = await supabaseAdmin
         .from('CS_ORDERS_PAID')
         .upsert({ 
           id: orderId, 
           name: orderData.customer_nombre,
           last_name: orderData.customer_apellido,
           status: 'pagado' 
         }, { onConflict: 'id' });

       if (error) {
         console.error('Error inserting CS_ORDERS_PAID:', error);
       }
     }
      // Actualizar status del pedido
      const { error: orderUpdateError } = await supabaseAdmin
        .from('CS_ORDERS')
        .update({ status: 'paid', stripe_session_id: session.id, stripe_payment_intent_id: (session.payment_intent as any)?.id || null })
        .eq('id', orderId);
      if (orderUpdateError) {
        console.error('Error updating order status:', orderUpdateError);
      }

      // Decrementar inventario del producto si hay productId y qty válidos
      if (productId > 0 && qty > 0) {
        const { error: inventoryError } = await supabaseAdmin.rpc('decrement_product_quantity', {
          p_product_id: productId,
          p_qty: qty,
        });
        if (inventoryError) {
          console.error('Error decrementing product inventory:', inventoryError);
        }
      }
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Error al recuperar la sesión' },
      { status: 500 }
    );
  }
}
