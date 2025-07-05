// src/utils/overpassUtils.js

export async function fetchNearbyPlaces(lat, lon, radius = 1000) {
    try {
      const response = await fetch("/api/overpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lon, radius }),
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Array of places
    } catch (err) {
      console.error("fetchNearbyPlaces error:", err);
      return [];
    }
  }
  