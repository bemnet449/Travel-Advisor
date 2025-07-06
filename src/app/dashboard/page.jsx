"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";

// Dynamically import the components to avoid SSR issues
const MapComponent = dynamic(() => import("../map/page"), { ssr: false });
const CurrencyComponent = dynamic(() => import("../currency/page"), { ssr: false });
const AiComponent = dynamic(() => import("../AiChat/page"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Map Section */}
      <section id="map-section" className="min-h-screen pt-16">
        <MapComponent />
      </section>
      
      {/* Currency Section */}
      <section id="currency-section" className="min-h-screen">
        <CurrencyComponent />
      </section>
      
      {/* AI Chat Section */}
      <section id="ai-section" className="min-h-screen">
        <AiComponent />
      </section>
    </div>
  );
} 