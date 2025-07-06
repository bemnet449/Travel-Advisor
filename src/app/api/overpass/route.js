// src/app/api/overpass/route.js

export async function POST(req) {
    try {
      const body = await req.json();
      const { lat, lon, radius = 1000 } = body;
  
      if (!lat || !lon) {
        return new Response(JSON.stringify({ error: "Latitude and longitude required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const delta = radius / 111000; // meters to degrees
      const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;
  
      const query = `
        [out:json];
        (
          node["amenity"~"bank|atm|bureau_de_change"](${bbox});
          way["amenity"~"bank|atm|bureau_de_change"](${bbox});
          relation["amenity"~"bank|atm|bureau_de_change"](${bbox});
        );
        out body;
        >;
        out skel qt;
      `;
  
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: query,
      });
  
      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }
  
            const data = await response.json();
      
      console.log("Overpass API response:", data); // Debug log
      console.log("Overpass elements:", data.elements); // Debug log

      return new Response(JSON.stringify(data.elements), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Overpass error:", err);
      return new Response(JSON.stringify({ error: "Failed to fetch Overpass data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  