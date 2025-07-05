import React from 'react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          TravelAdvisor
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Plan your journey with interactive maps and discover nearby places
        </p>
        <a href='/map'>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            Get Started
          </button>
        </a>
      </div>
    </div>
  )
}
