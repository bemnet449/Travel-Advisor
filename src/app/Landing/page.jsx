"use client";

import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/95 to-purple-900/95 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.2)_0%,_transparent_70%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

      <div className="text-center p-8 z-10">
        <h1 className="text-5xl font-extrabold text-cyan-400 tracking-wide mb-6 animate-[fadeIn_1s_ease-in-out] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          🌌 TravelAdvisor
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto animate-[fadeIn_1.5s_ease-in-out]">
        Explore cities, locate nearby banks, convert currencies instantly, and get personalized travel advice from our AI assistant—all in one place
        </p>
        <a href="/dashboard">
          <button className="relative bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <span className="relative z-10">Launch Adventure</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/50 to-purple-500/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </a>
      </div>
    </div>
  );
}