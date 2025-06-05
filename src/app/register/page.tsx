"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"muž" | "žena" | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.includes("@")) {
      setError("Zadej platný e-mail.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, gender }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Chyba při registraci.");
      }
    } catch (err) {
      setError("Něco se pokazilo.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">Staň se členem světla</h1>
      <p className="mb-6 text-sm text-yellow-200 text-center max-w-md">
        Zadej svůj e-mail a zvol pohlaví, ať vím s kým mluvím.
      </p>

      {!submitted ? (
        <>
          <input
            type="email"
            placeholder="tvůj@email.cz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 w-80 rounded-md border border-yellow-400 bg-black text-white"
          />

          <div className="mb-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="muž"
                checked={gender === "muž"}
                onChange={() => setGender("muž")}
              />
              Muž
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="žena"
                checked={gender === "žena"}
                onChange={() => setGender("žena")}
              />
              Žena
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition"
          >
            Odeslat
          </button>

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        </>
      ) : (
        <p className="text-green-400 mt-6 text-lg">Díky. Jsi na cestě poznání. 🌞</p>
      )}
    </main>
  );
}
