"use client";

import React, { useState, useEffect } from "react";

const BASE_URL = "/api/currency";

export default function CurrencyPage() {
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [destinationCurrency, setDestinationCurrency] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState([]); // [ [code, name], ... ]
  const [amount, setAmount] = useState("1"); // use string for controlled input
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch supported currencies on mount
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

  // Fetch exchange rate when currencies change
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

  // Update converted amount automatically when amount or rate changes
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (rate && numericAmount > 0) {
      setConvertedAmount((numericAmount * rate).toFixed(2));
    } else {
      setConvertedAmount(null);
    }
  }, [rate, amount]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            💱 Currency Converter
          </h1>
         
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-200"
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
                // Allow empty string or a valid positive number
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                  setAmount(val);
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-700/90 text-gray-100 focus:outline-none focus:border-indigo-400 transition-all"
              placeholder="Enter amount"
            />
          </div>

          {/* From Currency */}
          <div className="space-y-2">
            <label
              htmlFor="fromCurrency"
              className="block text-sm font-semibold text-gray-200"
            >
              From Currency
            </label>
            <select
              id="fromCurrency"
              value={homeCurrency}
              onChange={(e) => setHomeCurrency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-700/90 text-gray-100 focus:outline-none focus:border-indigo-400 transition-all"
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
              className="block text-sm font-semibold text-gray-200"
            >
              To Currency
            </label>
            <select
              id="toCurrency"
              value={destinationCurrency}
              onChange={(e) => setDestinationCurrency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-700/90 text-gray-100 focus:outline-none focus:border-indigo-400 transition-all"
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
                <span className="text-indigo-400 font-medium">Loading...</span>
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-lg">
                {error}
              </p>
            )}
            {!loading && !error && convertedAmount && (
              <p className="text-lg sm:text-xl font-semibold text-gray-100">
                {amount}{" "}
                <span className="font-bold text-indigo-400">{homeCurrency}</span>{" "}
                ={" "}
                <span className="font-bold text-green-400">{convertedAmount}</span>{" "}
                <span className="font-bold text-indigo-400">{destinationCurrency}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
