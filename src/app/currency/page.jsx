"use client";

import React, { useState, useEffect } from "react";

const BASE_URL = "/api/currency";

export default function CurrencyPage() {
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [destinationCurrency, setDestinationCurrency] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupportedCurrencies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?type=codes`);
        const data = await res.json();

        if (data.result === "success") {
          setCurrencies(data.supported_codes);
          setError("");
        } else {
          throw new Error(data.error || "Failed to fetch currency codes.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportedCurrencies();
  }, []);

  useEffect(() => {
    if (homeCurrency && destinationCurrency) {
      const fetchRate = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${BASE_URL}?base=${homeCurrency}`);
          const data = await res.json();

          if (data.result === "success") {
            setRate(data.conversion_rates[destinationCurrency]);
            setError("");
          } else {
            throw new Error(data.error || "Failed to fetch conversion rate.");
          }
        } catch (err) {
          setError(err.message);
          setRate(null);
        } finally {
          setLoading(false);
        }
      };

      fetchRate();
    }
  }, [homeCurrency, destinationCurrency]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (rate && numericAmount > 0) {
      setConvertedAmount((numericAmount * rate).toFixed(2));
    } else {
      setConvertedAmount(null);
    }
  }, [rate, amount]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-200 overflow-hidden">
      {/* Floating multiple currency icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dollars ($) */}
        <div className="absolute text-8xl text-pink-400 opacity-50 drop-shadow-lg animate-slow-float top-10 left-8 rotate-6">$</div>
        <div className="absolute text-6xl text-pink-300 opacity-55 drop-shadow-lg animate-slow-float bottom-20 right-10 -rotate-12">$</div>
        <div className="absolute text-9xl text-pink-500 opacity-45 drop-shadow-lg animate-slow-float top-1/3 right-1/4 rotate-3">$</div>

        {/* Pounds (£) */}
        <div className="absolute text-7xl text-indigo-400 opacity-50 drop-shadow-lg animate-slow-float top-1/4 left-1/5 -rotate-3">£</div>
        <div className="absolute text-5xl text-indigo-300 opacity-55 drop-shadow-lg animate-slow-float bottom-32 left-14 rotate-12">£</div>
        <div className="absolute text-8xl text-indigo-500 opacity-45 drop-shadow-lg animate-slow-float top-1/2 right-10 -rotate-6">£</div>

        {/* Euros (€) */}
        <div className="absolute text-6xl text-green-400 opacity-50 drop-shadow-lg animate-slow-float bottom-1/4 right-1/5 rotate-9">€</div>
        <div className="absolute text-9xl text-green-300 opacity-55 drop-shadow-lg animate-slow-float top-10 right-8 -rotate-9">€</div>
        <div className="absolute text-7xl text-green-500 opacity-45 drop-shadow-lg animate-slow-float bottom-10 left-1/3 rotate-3">€</div>
      </div>

      {/* Main converter card */}
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg border border-white/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 drop-shadow-lg">
            💱 Currency Converter
          </h1>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                  setAmount(val);
                }
              }}
              className="w-full px-4 py-3 rounded-full bg-white/70 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="Enter amount"
            />
          </div>

          {/* From Currency */}
          <div className="space-y-2">
            <label
              htmlFor="fromCurrency"
              className="block text-sm font-medium text-gray-700"
            >
              From Currency
            </label>
            <select
              id="fromCurrency"
              value={homeCurrency}
              onChange={(e) => setHomeCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/70 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label
              htmlFor="toCurrency"
              className="block text-sm font-medium text-gray-700"
            >
              To Currency
            </label>
            <select
              id="toCurrency"
              value={destinationCurrency}
              onChange={(e) => setDestinationCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/70 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div className="text-center min-h-[3rem]">
            {loading && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-pink-500 font-medium">Loading...</span>
                <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500 bg-red-100/50 p-3 rounded-lg">
                {error}
              </p>
            )}
            {!loading && !error && convertedAmount && (
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                {amount}{" "}
                <span className="font-bold text-pink-500">{homeCurrency}</span>{" "}
                ={" "}
                <span className="font-bold text-green-500">{convertedAmount}</span>{" "}
                <span className="font-bold text-pink-500">{destinationCurrency}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
