"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the components to avoid SSR issues
const MapComponent = dynamic(() => import("../map/page"), { ssr: false });
const CurrencyComponent = dynamic(() => import("../currency/page"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Map Section */}
      <section id="map-section" className="min-h-screen">
        <MapComponent />
      </section>
      
      {/* Currency Section */}
      <section id="currency-section" className="min-h-screen">
        <CurrencyComponent />
      </section>
    </div>
  );
} 