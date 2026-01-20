import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, rateId, quotationId } = await req.json();

    // 1. Obtener Token de Acceso (Ambiente Producción)
    const authRes = await fetch("https://pro.skydropx.com/api/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.SKYDROPX_CLIENT_ID,
        client_secret: process.env.SKYDROPX_CLIENT_SECRET,
      }),
    });
    
    // ERROR CORREGIDO: Solo se llama a .json() una vez
    const authData = await authRes.json();
    const access_token = authData.access_token;

    if (!access_token) {
       return NextResponse.json({ error: "No se pudo autenticar con Skydropx" }, { status: 401 });
    }

    // 2. Crear el envío (Shipment)
    // Según la documentación, se requiere el rate_id
    const shipmentRes = await fetch("https://pro.skydropx.com/api/v1/shipments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        rate_id: rateId, // El ID que obtuviste en el paso de cotización
        // quotation_id: quotationId (Opcional según el flujo)
      }),
    });

    const shipmentData = await shipmentRes.json();

    // 3. Validar respuesta de la API
    if (!shipmentData.data) {
      console.error("Error de Skydropx al crear guía:", JSON.stringify(shipmentData.errors, null, 2));
      return NextResponse.json({ error: "No se pudo generar la guía", details: shipmentData.errors }, { status: 400 });
    }

    // 4. Extraer información de la guía
    const attributes = shipmentData.data.attributes;
    const trackingNumber = attributes.tracking_number; // Número de seguimiento
    const labelUrl = attributes.label_url;             // URL del PDF de la guía

    // Paso sugerido: Actualizar Supabase aquí
    // await supabase.from('orders').update({ tracking_number: trackingNumber, label_url: labelUrl }).eq('id', orderId);

    return NextResponse.json({
      success: true,
      trackingNumber,
      labelUrl, // Este es el link que le darás al cliente para imprimir
    });

  } catch (error) {
    console.error("Error crítico al crear envío:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}