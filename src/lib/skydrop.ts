// app/lib/skydropx.ts
export async function getAccessToken() {
    const res = await fetch("https://sb-pro.skydropx.com/api/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.SKYDROPX_CLIENT_ID,
        client_secret: process.env.SKYDROPX_CLIENT_SECRET,
      }),
    });
    const data = await res.json();
    return data.access_token; // Este es tu Bearer Token
  }