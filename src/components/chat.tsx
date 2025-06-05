"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Zeptej se na cokoliv, já si vzpomenu." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Něco se pokazilo. Zkus to znovu." }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-black text-white border border-gray-800 rounded-xl h-[60vh]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl text-sm whitespace-pre-wrap max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-900 text-right ml-auto"
                : msg.role === "assistant"
                ? "bg-yellow-900 text-left"
                : "text-gray-500 text-center italic"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zeptej se..."
          className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-900 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded-xl font-semibold"
        >
          {loading ? "..." : "Odeslat"}
        </button>
      </form>
    </div>
  );
}
