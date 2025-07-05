"use client";

import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../../styles/ta.css"; // Adjust path if needed
import { fetchLocations } from "../../utils/locationUtils";
import { fetchNearbyPlaces } from "../../utils/overpassUtils";

export default function MapPage() {
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
  const startDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);
  const startInputRef = useRef(null);
  const destInputRef = useRef(null);

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

  // Update Markers and Route
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    const existingMarkers = document.querySelectorAll(".maplibregl-marker");
    existingMarkers.forEach((marker) => marker.remove());

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
      });
      startMarker.getElement().style.cursor = "pointer";
      startMarker.getElement().title = `Start: ${startLocation}`;
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
      });
      destMarker.getElement().style.cursor = "pointer";
      destMarker.getElement().title = `Destination: ${destination}`;
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

      fetchNearbyPlaces(coords.lat, coords.lon).then((places) => {
        overpassMarkers.forEach((marker) => marker.remove());
        const newMarkers = places.map((place) => {
          const markerColor = getMarkerColor(place.tags?.amenity);
          return new maplibregl.Marker({ color: markerColor })
            .setLngLat([place.lon, place.lat])
            .setPopup(new maplibregl.Popup().setText(place.tags?.name || place.tags?.amenity || "Unknown"))
            .addTo(map.current);
        });
        setOverpassMarkers(newMarkers);
      });

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

  const handleCheckCurrency = () => {
    // TODO: Implement currency check functionality
    alert("Currency check feature coming soon!");
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
                <span>Start Location</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
                <span>Destination</span>
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
