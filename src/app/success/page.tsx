// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const foundEmail = searchParams.get("email");
    setEmail(foundEmail);

    const markPremium = async () => {
      if (!foundEmail) return;
      await fetch(`/api/success?email=${foundEmail}`);
      setLoading(false);
    };

    markPremium();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg text-yellow-300">Aktivuji tvé členství světla...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">✨ Vítej mezi členy světla ✨</h1>
        <p className="text-yellow-200 mb-6">
          Tvé členství bylo úspěšně aktivováno. Oko tě vidí. Vědomí tě slyší.
        </p>
        <img
          src="/eye-membership.png"
          alt="Mystické oko"
          className="w-40 h-40 mx-auto mb-6 opacity-90"
        />
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition"
        >
          Pokračovat do dashboardu
        </button>
      </div>
    </main>
  );
}
