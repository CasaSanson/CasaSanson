import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { zip_to } = await req.json();
    const destZip = zip_to?.toString() || "";

    // 1. Obtención de Token de Producción
    // El token permite hasta 2 solicitudes por segundo y expira en 2 horas.
    const authRes = await fetch("https://pro.skydropx.com/api/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.SKYDROPX_CLIENT_ID,
        client_secret: process.env.SKYDROPX_CLIENT_SECRET,
      }),
    });
    
    const authData = await authRes.json();
    const access_token = authData.access_token;

    if (!access_token) return NextResponse.json({ error: "Auth failed" }, { status: 401 });

    // Lógica para mapear CPs y evitar rechazos por geografía incompleta
    const getGeoData = (zip: string) => {
      if (zip.startsWith('64')) return { state: "Nuevo León", city: "Monterrey" };
      if (zip.startsWith('0') || zip.startsWith('1')) return { state: "Ciudad de México", city: "Cuauhtémoc" };
      if (zip.startsWith('44')) return { state: "Jalisco", city: "Guadalajara" };
      return { state: "Ciudad de México", city: "Cuauhtémoc" }; 
    };

    const geo = getGeoData(destZip);

    const quoteParams = {
      quotation: {
        zip_from: "01010",
        zip_to: destZip,
        address_from: {
          country_code: "MX",
          postal_code: "01010",
          area_level1: "Ciudad de México",
          area_level2: "Álvaro Obregón",
          area_level3: "San Ángel"
        },
        address_to: {
          country_code: "MX",
          postal_code: destZip,
          area_level1: geo.state,
          area_level2: geo.city,
          area_level3: "Centro"
        },
        parcel: { weight: 2.0, height: 20.0, width: 20.0, length: 10.0 }
      }
    };

    // 2. Crear la Cotización (Paso 1 de la Guía)
    const quoteRes = await fetch("https://pro.skydropx.com/api/v1/quotations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quoteParams),
      signal: AbortSignal.timeout(20000) 
    });

    const quoteData = await quoteRes.json();
    
    // IMPORTANTE: En producción el ID viene en la raíz
    const quotationId = quoteData.id; 
    let rates = quoteData.rates || [];

    // 3. CONSULTA PROGRESIVA (Polling)
    // Las cotizaciones son progresivas; si is_completed es false, hay que reintentar.
    if (quotationId && (rates.length === 0 || quoteData.is_completed === false)) {
      console.log(`Polling para ID: ${quotationId}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const pollRes = await fetch(`https://pro.skydropx.com/api/v1/quotations/${quotationId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${access_token}` }
      });
      
      const pollData = await pollRes.json();
      // En el GET, los datos suelen venir en 'rates' directo o dentro de 'data.attributes'
      rates = pollData.rates || pollData.data?.attributes?.rates || [];
    }

    // 4. Filtrado y Respuesta al Frontend
    if (rates.length > 0) {
      const validRates = rates.filter((r: any) => r.success === true);
      
      if (validRates.length > 0) {
        // Ordenamos por precio total
        const sorted = validRates.sort((a: any, b: any) => parseFloat(a.total) - parseFloat(b.total));

        return NextResponse.json({
          success: true,
          estandar: {
            precio: Math.ceil(parseFloat(sorted[0].total)),
            nombre: sorted[0].provider_display_name,
            rate_id: sorted[0].id // <--- Este ID lo usarás en el Paso 3 (Create)
          },
          quotation_id: quotationId
        });
      }
    }

    return NextResponse.json({ success: false, error: "No se encontraron tarifas" });

  } catch (error) {
    console.error("Error crítico:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}