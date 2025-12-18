import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ✅ SOLO checkout exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      const metadata = session.metadata as {
        orderId?: string;
        variantId?: string;
        quantity?: string;
      };

      const orderId = metadata.orderId;
      const variantId = metadata.variantId;
      const qty = parseInt(metadata.quantity || '1', 10);

      if (!orderId) {
        return NextResponse.json({ ok: true });
      }

      // 🔐 Idempotencia
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (fetchError) {
        console.error('Error fetching order:', fetchError);
        return NextResponse.json({ ok: false });
      }

      if (order.status !== 'paid') {
        // 1️⃣ Marcar pedido como pagado
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
          return NextResponse.json({ ok: false });
        }

        // 2️⃣ Bajar stock de la VARIANTE
        if (variantId && qty > 0) {
          const { data: variant, error: variantError } =
            await supabaseAdmin
              .from('product_variants')
              .select('stock')
              .eq('id', variantId)
              .single();

          if (variantError) {
            console.error('Error fetching variant:', variantError);
          } else {
            const newStock = Math.max(variant.stock - qty, 0);

            const { error: stockError } = await supabaseAdmin
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', variantId);

            if (stockError) {
              console.error('Error updating stock:', stockError);
            }
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
