export async function GET(req) {
    const API_KEY = process.env.EXCHANGERATE_API_KEY;
  
    if (!API_KEY) {
      console.error("❌ Missing EXCHANGERATE_API_KEY");
      return new Response(
        JSON.stringify({ error: "API key not set in server" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const base = searchParams.get("base") || "USD";
  
    let apiUrl;
  
    if (type === "codes") {
      apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;
      console.log("➡️ Fetching supported currency codes from:", apiUrl);
    } else {
      apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;
      console.log(`➡️ Fetching conversion rates for base '${base}' from:`, apiUrl);
    }
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error("❌ External API error:", response.statusText);
        return new Response(
          JSON.stringify({ error: "Failed to fetch data from external API" }),
          { status: response.status, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("❌ Server error:", err);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  