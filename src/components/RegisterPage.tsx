"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-300 p-8">
      <h1 className="text-3xl font-bold mb-6">Vytvoř si účet světla</h1>
      <input
        className="mb-4 p-2 w-80 rounded bg-black border border-yellow-500 text-white"
        type="email"
        placeholder="Tvůj e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 p-2 w-80 rounded bg-black border border-yellow-500 text-white"
        type="password"
        placeholder="Tvé heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <button
        onClick={handleRegister}
        className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400"
      >
        Zaregistrovat se
      </button>
    </div>
  );
}
