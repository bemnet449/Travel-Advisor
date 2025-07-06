"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AiChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🌍 Hello! I'm your AI travel assistant.\nWhere would you like to go today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter((m) => m.sender !== "system")
              .map((m) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
              })),
            { role: "user", content: inputMessage },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI API error");
      }

      const aiReply = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      const errorReply = {
        id: Date.now() + 1,
        text: "⚠️ Sorry, I couldn't get a response from the AI service. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 animate-gradient-x">
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-3xl h-[80vh] border border-white/30 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md animate-fade-in">
            ✈️ AI Travel Assistant
          </h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 sm:p-4 rounded-xl shadow-md transition transform hover:scale-105 ${
                  message.sender === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="prose prose-sm sm:prose lg:prose-lg">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{message.text}</p>
                )}
                <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/30 text-white p-3 rounded-lg animate-pulse">
                <span>✈️ Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about destinations, visas, or hotels..."
            className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 backdrop-blur-md"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 text-white font-semibold transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
