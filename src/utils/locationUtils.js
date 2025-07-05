import axios from "axios";

export const fetchLocations = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      }
    );

    // Convert response to formatted locations
    const locations = response.data.map((place) => {
      const city =
        place.address.city || place.address.town || place.address.village || "";
      const state = place.address.state || "";
      const country = place.address.country || "";

      return {
        label: `${city}${state ? ", " + state : ""}, ${country}`,
        value: place.display_name, // Original display_name
        lat: place.lat,
        lon: place.lon,
        place_id: place.place_id,
        type: place.type,
        class: place.class
      };
    });

    // Remove duplicates using a Set
    const uniqueLocations = Array.from(
      new Map(locations.map((item) => [item.label, item])).values()
    );

    return uniqueLocations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}; 