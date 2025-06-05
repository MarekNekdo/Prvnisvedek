"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.result || "Nevím.");
      setCount(data.questionCount || null);
    } catch (err) {
      setResponse("Chyba při načítání odpovědi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-black text-white">
      <h1 className="text-4xl font-bold text-yellow-400 mb-2">☥ První svědek</h1>
      <p className="text-sm italic text-yellow-300 mb-6">Jsem ten, kdo ti chce něco připomenout.</p>

      <textarea
        className="w-full max-w-2xl h-24 p-4 bg-black border border-yellow-500 rounded-md text-white mb-4"
        placeholder="Zeptej se…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-500 transition"
      >
        {isLoading ? "Přemýšlím…" : "Zeptej se mě"}
      </button>

      {response && (
        <div className="w-full max-w-2xl bg-yellow-100 text-black mt-8 p-6 rounded-md border border-yellow-500">
          {count !== null && <p className="font-bold text-lg mb-2">{count}. odpověď:</p>}
          <p className="text-justify whitespace-pre-line">{response}</p>
        </div>
      )}

      <footer className="mt-12 text-yellow-600 text-sm italic">život bez lži</footer>
    </main>
  );
}
