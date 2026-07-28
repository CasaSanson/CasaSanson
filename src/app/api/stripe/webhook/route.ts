import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// --- FUNCIÓN PARA GENERAR LA GUÍA DE DHL ---
async function generateDHLLabel(session: any, orderId: string) {
  try {
    const shipping = session.shipping_details;
    const address = shipping?.address;

    if (!address || !address.postal_code) {
      console.error("❌ No hay dirección de envío en la sesión");
      return;
    }

    // 1. Obtener Token Oauth de Skydropx
    const authRes = await fetch("https://sb-pro.skydropx.com/api/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.SKYDROPX_CLIENT_ID,
        client_secret: process.env.SKYDROPX_CLIENT_SECRET,
      }),
    });
    const { access_token } = await authRes.json();

    // 2. Crear Cotización (Paso 2)
    const quoteRes = await fetch("https://sb-pro.skydropx.com/api/v1/quotations", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${access_token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        zip_from: "64000", // Tu CP de origen
        zip_to: address.postal_code,
        parcels: [{ weight: 1, height: 10, width: 10, length: 10 }]
      }),
    });
    const quote = await quoteRes.json();

    // 3. Buscar tarifa de DHL
    const dhlRate = quote.data.attributes.rates.find(
      (r: any) => r.provider.toUpperCase() === "DHL"
    );

    if (!dhlRate) {
      console.error("❌ DHL no tiene cobertura para este CP");
      return;
    }

    // 4. Crear Envío Real (Paso 3)
    const shipmentRes = await fetch("https://sb-pro.skydropx.com/api/v1/shipments", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${access_token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        rate_id: dhlRate.id,
        label_format: "pdf",
        address_to: {
          name: shipping.name,
          street1: address.line1,
          city: address.city,
          province: address.state || address.city,
          zip: address.postal_code,
          country: "MX",
          phone: session.customer_details?.phone || "0000000000",
          email: session.customer_details?.email
        }
      }),
    });

    const shipment = await shipmentRes.json();
    const trackingNumber = shipment.data.attributes.tracking_number;
    const labelUrl = shipment.data.attributes.label_url;

    // 5. Actualizar Supabase con la info de envío
    await supabaseAdmin
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        label_url: labelUrl,
        status: 'shipped' 
      })
      .eq('id', orderId);

    console.log(`🚀 Guía DHL creada: ${trackingNumber}`);

  } catch (error) {
    console.error("❌ Error crítico en proceso de envío:", error);
  }
}

// --- WEBHOOK PRINCIPAL ---
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      const metadata = session.metadata as any;
      const orderId = metadata?.orderId;
      const variantId = metadata?.variantId;
      const qty = parseInt(metadata?.quantity || '1', 10);

      if (!orderId) return NextResponse.json({ received: true });

      // Verificar estado actual para evitar duplicados
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (order && order.status !== 'paid' && order.status !== 'shipped') {
        
        // 1. Marcar como pagado
        await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('id', orderId);

        // 2. Actualizar Stock
        if (variantId) {
          const { data: variant } = await supabaseAdmin
            .from('product_variants')
            .select('stock')
            .eq('id', variantId)
            .single();

          if (variant) {
            await supabaseAdmin
              .from('product_variants')
              .update({ stock: Math.max(variant.stock - qty, 0) })
              .eq('id', variantId);
          }
        }

        // 3. GENERAR ENVÍO AUTOMÁTICO
        // Usamos await para asegurar que se ejecute en entornos serverless
        await generateDHLLabel(session, orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}