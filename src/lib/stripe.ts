import Stripe from 'stripe';

// Configuración del cliente de Stripe para el servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Función para crear sesión de checkout
export const createCheckoutSession = async (
  priceId: string,
  quantity: number = 1,
  metadata: Record<string, string> = {}
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ 
      price: priceId, 
      quantity: quantity 
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    metadata,
  });

  return session;
};

// Función para recuperar una sesión de checkout
export const retrieveCheckoutSession = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer', 'payment_intent'],
  });
};

// Función para crear un producto
export const createProduct = async (name: string, description?: string) => {
  return await stripe.products.create({
    name,
    description,
  });
};

// Función para crear un precio
export const createPrice = async (
  productId: string,
  unitAmount: number,
  currency: string = 'eur'
) => {
  return await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency,
  });
};

// Función para listar productos
export const listProducts = async (limit: number = 10) => {
  return await stripe.products.list({ limit });
};

// Función para listar precios de un producto
export const listPrices = async (productId: string) => {
  return await stripe.prices.list({
    product: productId,
    active: true,
  });
};