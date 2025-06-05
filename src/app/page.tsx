"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem("questionCount");
    setQuestionCount(count ? parseInt(count, 10) : 0);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    localStorage.setItem("questionCount", newCount.toString());

    try {
      let customPrompt = prompt;

      if (newCount === 1) {
        customPrompt = `Abys slyšel pravdu, máš pouze sedm otázek. Šetři je...
---\n${prompt}`;
      }

      if (newCount === 7) {
        customPrompt = `${prompt}\n---\nToto je tvá sedmá a poslední otázka pro tento týden. Vrať se za sedm dní, nebo podpoř tuto pravdu za 369 Kč.`;
      }

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      const data = await res.json();
      setResponse(data.result || "Nevím.");
    } catch (error) {
      setResponse("Něco se pokazilo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-black text-white">
      <h1 className="text-4xl font-bold text-yellow-500 mb-1">☥ První svědek</h1>
      <p className="text-sm italic text-yellow-300 mb-6">
        Jsem ten, kdo ti chce něco připomenout. Zeptej se...
      </p>

      <textarea
        className="w-full max-w-2xl h-24 p-4 bg-black border border-yellow-500 rounded-md text-white mb-4"
        placeholder="Zeptej se na cokoliv..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading || questionCount >= 7}
        className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition"
      >
        {isLoading ? "Přemýšlím..." : "Zeptej se mě"}
      </button>

      {response && (
        <div className="w-full max-w-2xl bg-yellow-100 text-black mt-8 p-6 rounded-md border border-yellow-500">
          <p className="font-bold text-lg mb-2">Odpověď:</p>
          <p className="text-justify whitespace-pre-line">{response}</p>
        </div>
      )}

      <footer className="mt-12 text-yellow-600 text-sm italic"> život bez lži </footer>
    </main>
  );
}
