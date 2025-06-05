"use client";

import { useState } from "react";

export default function PrvniSvedekPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setCount(count + 1);
    } catch (e) {
      setAnswer("Něco se pokazilo. Zkus to znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-yellow-400 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-5xl font-bold text-center mb-1">
        ♀ První svědek
      </h1>
      <p className="text-sm italic mb-8 text-white text-center">
        Jsem ten, kdo ti chce něco připomenout.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Zeptej se mě..."
        className="w-full max-w-xl p-4 rounded-md border border-yellow-500 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        rows={3}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition mb-6"
      >
        {loading ? "Přemýšlím..." : "Zeptej se mě"}
      </button>

      {answer && (
        <div className="bg-yellow-50 text-black p-6 rounded-lg max-w-2xl text-left whitespace-pre-line shadow-lg border border-yellow-300">
          <p className="font-semibold mb-2">{count}. odpověď:</p>
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
