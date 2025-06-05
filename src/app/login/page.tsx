"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/welcome");
      } else {
        setError(data.error || "Chyba přihlášení.");
      }
    } catch {
      setError("Něco se pokazilo.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">Přihlas se ke svému vědomí</h1>

      <input
        type="email"
        placeholder="tvůj@email.cz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 w-80 rounded-md border border-yellow-400 bg-black text-white"
      />
      <input
        type="password"
        placeholder="Tvé heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-3 w-80 rounded-md border border-yellow-400 bg-black text-white"
      />
      <button
        onClick={handleLogin}
        className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition"
      >
        Přihlásit se
      </button>
      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
    </main>
  );
}
