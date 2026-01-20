// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, quantity, customerInfo, orderId } = await request.json();

    // 1. Buscar producto y variante en Supabase para obtener precio real
    const { data: product, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const variant = product.product_variants?.find((v: { id: string; price?: number }) => v.id === variantId);
    
    // Convertir a centavos para Stripe
    const unitAmount = Math.round(((variant?.price ?? product.base_price) || 0) * 100);

    // 2. Calcular costo de envío (Express $250 / Estándar $150)
    const shippingMethod = customerInfo?.metodoEnvio as string | undefined;
    const shippingAmountMx = shippingMethod === 'express' ? 250 : shippingMethod === 'estandar' ? 150 : 0;
    const shippingAmount = Math.round(shippingAmountMx * 100);

    // 3. Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: product.name,
              description: `Talla: ${customerInfo.talla || 'N/A'}. ${customerInfo.personalizado ? `Personalizado: ${customerInfo.personalizado}` : ''}`,
              images: [
                product.image.startsWith("http")
                  ? product.image
                  : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${product.image}`,
              ],
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
        ...(shippingAmount > 0
          ? [
              {
                price_data: {
                  currency: 'mxn',
                  product_data: {
                    name: `Envío ${shippingMethod === 'express' ? 'Express (DHL)' : 'Estándar'}`,
                  },
                  unit_amount: shippingAmount,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/catalogo/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/catalogo/comprar/${productId}`,
      
      customer_email: customerInfo.email,

      // IMPORTANTE: Esto vincula la dirección del form con el objeto oficial de Stripe
      payment_intent_data: {
        shipping: {
          name: `${customerInfo.nombre} ${customerInfo.apellido}`,
          address: {
            line1: customerInfo.direccion,
            city: customerInfo.ciudad,
            postal_code: customerInfo.codigoPostal,
            country: 'MX', // Skydropx requiere código ISO de 2 letras
            state: customerInfo.ciudad, // Usamos ciudad como estado si no tienes el campo separado
          },
        },
        metadata: {
            orderId: orderId, // Duplicamos aquí por seguridad
        }
      },

      // Metadatos para rastreo fácil en el dashboard de Stripe
      metadata: {
        orderId: orderId,
        productId: productId.toString(),
        variantId: variantId ?? '',
        customerPhone: customerInfo.telefono,
        shippingMethod: shippingMethod || 'estandar',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}