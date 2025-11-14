import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { products } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, customerInfo, orderId } = await request.json();

    // Buscar el producto
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Extraer el precio numérico del string
    const priceMatch = product.price.match(/\$?([0-9,]+\.?[0-9]*)/);
    if (!priceMatch) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    const unitAmount = Math.round(parseFloat(priceMatch[1].replace(',', '')) * 100); // Convertir a centavos

    // Calcular costo de envío según el método elegido en el formulario (no volver a preguntar en Stripe)
    const shippingMethod = customerInfo?.metodoEnvio as string | undefined;
    const shippingAmountMx = shippingMethod === 'express' ? 250 : shippingMethod === 'estandar' ? 150 : 0;
    const shippingAmount = Math.round(shippingAmountMx * 100); // en centavos

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${product.image}`],
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
                    name: `Envío (${shippingMethod === 'express' ? 'express' : shippingMethod === 'estandar' ? 'estándar' : 'estudio'})`,
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
      metadata: {
        orderId: orderId,
        productId: productId.toString(),
        quantity: quantity.toString(),
        customerName: `${customerInfo.nombre} ${customerInfo.apellido}`,
        customerPhone: customerInfo.telefono,
        shippingMethod: customerInfo.metodoEnvio,
        address: customerInfo.direccion || '',
        city: customerInfo.ciudad || '',
        postalCode: customerInfo.codigoPostal || '',
        country: customerInfo.pais || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}