// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { cart, shippingCost, customerInfo, orderId } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // 1. Mapear todos los productos del carrito a line_items de Stripe
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: `${item.name} - Talla ${item.selectedVariant.size}`,
          description: item.personalizedText ? `Personalizado: ${item.personalizedText}` : undefined,
          images: [
            item.image.startsWith("http")
              ? item.image
              : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${item.image}`,
          ],
        },
        // Stripe requiere el monto en centavos
        unit_amount: Math.round((item.selectedVariant.price ?? item.base_price ?? 0) * 100),
      },
      quantity: item.quantity,
    }));

    // 2. Añadir el costo de envío como un item adicional
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Envío ${customerInfo.metodoEnvio === 'express' ? 'Express (DHL)' : 'Estándar'}`,
            description: 'Tarifa calculada por Skydropx',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // 3. Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // Redirigir a la página de éxito que limpia el carrito
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/catalogo/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/catalogo/comprar`,
      
      customer_email: customerInfo.email,

      payment_intent_data: {
        shipping: {
          name: `${customerInfo.nombre} ${customerInfo.apellido}`,
          address: {
            line1: customerInfo.direccion,
            city: customerInfo.ciudad,
            postal_code: customerInfo.codigoPostal,
            country: 'MX',
            state: customerInfo.ciudad,
          },
        },
        metadata: {
            orderId: orderId,
        }
      },

      metadata: {
        orderId: orderId,
        customerPhone: customerInfo.telefono,
        shippingMethod: customerInfo.metodoEnvio || 'estandar',
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