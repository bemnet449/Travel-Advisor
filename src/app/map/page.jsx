"use client";

import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../../styles/ta.css"; // Adjust path if needed
import { fetchLocations } from "../../utils/locationUtils";
import { fetchNearbyPlaces } from "../../utils/overpassUtils";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const router = useRouter();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [overpassMarkers, setOverpassMarkers] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [isDestLoading, setIsDestLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFlyingToDestination, setIsFlyingToDestination] = useState(false);
  const [showOverpass, setShowOverpass] = useState(false);
  const startDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);
  const startInputRef = useRef(null);
  const destInputRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);

  const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  // Initialize MapLibre
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: [38.7578, 9.0301], // Addis Ababa default
      zoom: 5,
    });



    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [MAPTILER_API_KEY]);

  const addOverpassMarkers = (places) => {
    console.log("Adding overpass markers with data:", places);
    
    overpassMarkers.forEach((marker) => marker.remove());
  
    // Filter for places with coordinates and amenity tags
    const validPlaces = places.filter((p) => {
      const hasAmenity = p.tags && p.tags.amenity;
      
      if (!hasAmenity) return false;
      
      // For nodes, use lat/lon directly
      if (p.type === 'node') {
        return Number.isFinite(p.lon) && Number.isFinite(p.lat);
      }
      
      // For ways (polygons), check if they have lat/lon (some do)
      if (p.type === 'way') {
        return Number.isFinite(p.lon) && Number.isFinite(p.lat);
      }
      
      return false;
    });
  
    console.log(
      `Total places: ${places.length}, Valid places: ${validPlaces.length}`
    );
    console.log("Valid places:", validPlaces);
  
    const newMarkers = validPlaces.map((place) => {
      const amenityType = place.tags?.amenity
        ? capitalize(place.tags.amenity.replace(/_/g, " "))
        : "Amenity";
  
      const name = place.tags?.name || place.tags?.brand || "Unknown";
  
      const popupHTML = `
        <div style="font-size: 14px; padding: 8px; max-width: 250px;">
          <strong style="color: #333; font-size: 16px;">${name}</strong><br/>
          <span style="color: #666; font-size: 12px;">${amenityType}</span>
          ${place.tags?.brand && place.tags.brand !== name ? `<br/><span style="color: #888; font-size: 11px;">Brand: ${place.tags.brand}</span>` : ""}
          ${place.tags?.opening_hours ? `<br/><span style="color: #888; font-size: 11px;">Hours: ${place.tags.opening_hours}</span>` : ""}
          ${place.tags?.atm === 'yes' ? `<br/><span style="color: green; font-size: 11px;">✓ ATM Available</span>` : ""}
          ${place.tags?.wheelchair === 'yes' ? `<br/><span style="color: blue; font-size: 11px;">♿ Wheelchair Accessible</span>` : ""}
          ${place.tags?.['addr:street'] ? `<br/><span style="color: #666; font-size: 11px;">📍 ${place.tags['addr:street']}</span>` : ""}
        </div>
      `;
  
      const markerColor = getMarkerColor(place.tags?.amenity);
  
      console.log(`Creating marker for ${name} at [${place.lon}, ${place.lat}] with color ${markerColor}`);
  
      const marker = new maplibregl.Marker({ color: markerColor })
        .setLngLat([place.lon, place.lat])
        .addTo(map.current);
  
      // Add a title attribute for debugging
      marker.getElement().title = `Click to see details for ${name}`;
      
      marker.getElement().addEventListener("click", () => {
        console.log(`Marker clicked for ${name}`);
        console.log(`Popup content:`, popupHTML);
        
        // Close any existing popups first
        const existingPopups = document.querySelectorAll('.maplibregl-popup');
        existingPopups.forEach(p => p.remove());
        
        // Create and show the popup
        const newPopup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: 'custom-popup',
          offset: 10
        })
        .setLngLat([place.lon, place.lat])
        .setHTML(popupHTML)
        .addTo(map.current);
        
        console.log('Popup added to map:', newPopup);
        
        map.current.flyTo({
          center: [place.lon, place.lat],
          zoom: 15,
          speed: 1.5,
          curve: 1.2,
          essential: true,
        });
      });
      
      // Also add a hover effect
      marker.getElement().style.cursor = "pointer";
  
      return marker;
    });
  
    console.log(`Created ${newMarkers.length} markers`);
    setOverpassMarkers(newMarkers);
  };
  

  // Update Markers and Route
  useEffect(() => {
    if (!map.current) return;

    // Remove old start/destination markers
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    // Clear overpass markers when coordinates change
    overpassMarkers.forEach((marker) => marker.remove());
    setOverpassMarkers([]);

    // Remove old routes
    if (map.current.getSource("route")) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }

    if (startCoords) {
      const startMarker = new maplibregl.Marker({ color: "#4CAF50", scale: 0.8 })
        .setLngLat([startCoords.lon, startCoords.lat])
        .addTo(map.current);

      startMarker.getElement().addEventListener("click", () => {
        map.current.flyTo({
          center: [startCoords.lon, startCoords.lat],
          zoom: 12,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
        fetchNearbyPlaces(startCoords.lat, startCoords.lon).then(addOverpassMarkers);
      });

      startMarker.getElement().style.cursor = "pointer";
      startMarker.getElement().title = `Start: ${startLocation} (Click to see nearby places)`;
      startMarkerRef.current = startMarker;
    }

    if (destCoords) {
      const destMarker = new maplibregl.Marker({ color: "#F44336", scale: 0.8 })
        .setLngLat([destCoords.lon, destCoords.lat])
        .addTo(map.current);

      destMarker.getElement().addEventListener("click", () => {
        map.current.flyTo({
          center: [destCoords.lon, destCoords.lat],
          zoom: 12,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
        fetchNearbyPlaces(destCoords.lat, destCoords.lon).then(addOverpassMarkers);
      });

      destMarker.getElement().style.cursor = "pointer";
      destMarker.getElement().title = `Destination: ${destination} (Click to see nearby places)`;
      destMarkerRef.current = destMarker;
    }

    if (startCoords && destCoords && !isFlyingToDestination) {
      const bounds = [
        [Math.min(startCoords.lon, destCoords.lon), Math.min(startCoords.lat, destCoords.lat)],
        [Math.max(startCoords.lon, destCoords.lon), Math.max(startCoords.lat, destCoords.lat)],
      ];
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [startCoords, destCoords, startLocation, destination, isFlyingToDestination]);

  const fetchSuggestions = async (query, setSuggestions, setIsLoading) => {
    if (!query) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const locations = await fetchLocations(query);
      setSuggestions(locations);
    } catch (err) {
      setError(`Error fetching suggestions: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value, isStart) => {
    if (isStart) setStartLocation(value);
    else setDestination(value);

    const timer = isStart ? startDebounceTimer : destDebounceTimer;
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      fetchSuggestions(value, isStart ? setStartSuggestions : setDestSuggestions, isStart ? setIsStartLoading : setIsDestLoading);
    }, 300);
  };

  const handleSuggestionClick = (suggestion, isStart) => {
    const coords = {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    };

    if (isStart) {
      setStartLocation(suggestion.value);
      setStartCoords(coords);
      setStartSuggestions([]);
      map.current.flyTo({
        center: [coords.lon, coords.lat],
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    } else {
      setDestination(suggestion.value);
      setDestCoords(coords);
      setDestSuggestions([]);

      map.current.flyTo({
        center: [coords.lon, coords.lat],
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  };

  const getMarkerColor = (amenity) => {
    if (amenity === "bank") return "blue";
    if (amenity === "atm") return "green";
    if (amenity === "bureau_de_change") return "yellow";
    return "gray";
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const handleCheckCurrency = () => {
    // Scroll to currency section smoothly
    const currencySection = document.getElementById('currency-section');
    if (currencySection) {
      currencySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleAIChat = () => {
    // TODO: Implement AI chat functionality
    alert("AI Chat feature coming soon!");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">🗺️ Travel Map</h1>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleCheckCurrency}>
              💱 Check Currency
            </button>
            <button className="btn btn-secondary" onClick={handleAIChat}>
              🤖 AI Chat
            </button>
          </div>
        </div>

        <div className="map-container">
          <div className="location-inputs">
            <div className="input-container">
              {/* Start Location */}
              <div className="input-group">
                <label htmlFor="start-location">📍 Start Location</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="start-location"
                    type="text"
                    value={startLocation}
                    onChange={(e) => handleInputChange(e.target.value, true)}
                    placeholder="Enter start city or location"
                    ref={startInputRef}
                  />
                  {isStartLoading && <div className="loading-spinner"></div>}
                </div>
                {startSuggestions.length > 0 && (
                  <ul className="suggestions start-suggestions">
                    {startSuggestions.map((s, i) => (
                      <li key={`start-${i}`} onClick={() => handleSuggestionClick(s, true)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📍</span>
                          <span>{s.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Destination */}
              <div className="input-group">
                <label htmlFor="destination">🎯 Destination</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => handleInputChange(e.target.value, false)}
                    placeholder="Enter destination city or location"
                    ref={destInputRef}
                  />
                  {isDestLoading && <div className="loading-spinner"></div>}
                </div>
                {destSuggestions.length > 0 && (
                  <ul className="suggestions dest-suggestions">
                    {destSuggestions.map((s, i) => (
                      <li key={`dest-${i}`} onClick={() => handleSuggestionClick(s, false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🎯</span>
                          <span>{s.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-title">📍 Map Markers</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                <span>Start Location (Clickable)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
                <span>Destination (Clickable)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'blue' }}></div>
                <span>Banks</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'green' }}></div>
                <span>ATMs</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'yellow' }}></div>
                <span>Currency Exchange</span>
              </div>
            </div>
          </div>

          <div ref={mapContainer} className="map"></div>
        </div>
      </div>
    </div>
  );
}