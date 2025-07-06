"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/90 to-purple-900/90 border-b border-cyan-500/30 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-extrabold text-cyan-400 tracking-wider animate-pulse">
              🌌 TravelAdvisor
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("map-section")}
              className="relative text-gray-200 hover:text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              <span className="relative z-10">🗺️ Map</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection("currency-section")}
              className="relative text-gray-200 hover:text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              <span className="relative z-10">💱 Currency</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection("ai-section")}
              className="relative text-gray-200 hover:text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              <span className="relative z-10">🤖 AI Chat</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-cyan-400 hover:text-cyan-200 p-2 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-all duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-xl bg-gradient-to-b from-gray-900/90 to-purple-900/90 shadow-2xl border border-cyan-500/30">
            <div className="px-4 pt-4 pb-4 space-y-2">
              <button
                onClick={() => scrollToSection("map-section")}
                className="block w-full text-gray-200 hover:text-cyan-400 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                🗺️ Map
              </button>
              <button
                onClick={() => scrollToSection("currency-section")}
                className="block w-full text-gray-200 hover:text-cyan-400 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                💱 Currency
              </button>
              <button
                onClick={() => scrollToSection("ai-section")}
                className="block w-full text-gray-200 hover:text-cyan-400 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 bg-gray-800/50 hover:bg-cyan-500/20 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                🤖 AI Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}