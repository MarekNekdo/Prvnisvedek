// components/SeventhQuestionOptions.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SeventhQuestionOptions({ onSubmitted }: { onSubmitted: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email) return;
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        onSubmitted();
      }
    } catch (err) {
      console.error("Email odeslání selhalo", err);
    }
  };

  if (submitted) {
  return (
    <div className="text-center text-yellow-300 mt-6 space-y-4">
      <p className="text-lg">Děkuji. Jako První svědek ti posílám e-mail. Je tvůj čas.</p>
      <div className="flex flex-col items-center space-y-2">
        <a
          href="/registrace"
          className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-500 transition"
        >
          💫 Stát se členem světla (369 Kč)
        </a>
        <a
          href="https://www.onlinerestart.cz"
          target="_blank"
          className="underline text-sm text-yellow-400 hover:text-yellow-300"
        >
          📚 Stáhnout Genesis 2.0 a Nové Desatero zdarma.
        </a>
      </div>
    </div>
  );
}


  return (
    <div className="mt-8 text-center text-yellow-300">
      <h2 className="text-xl font-bold mb-4">Vyber si svou cestu:</h2>
      <div className="space-y-4">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          onClick={() => window.location.href = "/clenstvi"}
        >
          Staň se členem světla (369 Kč/měsíc)
        </button>

        <Link href="https://onlinerestart.cz" target="_blank">
          <span className="underline text-yellow-400 block mt-2">
            Nebo si zdarma stáhni Genesis 2.0 a Nové Desatero.
          </span>
        </Link>

        <div className="mt-6">
          <p className="mb-2">Zadej svůj e-mail a buď připraven, až tě První svědek osloví:</p>
          <input
            type="email"
            placeholder="tvuj@email.cz"
            className="px-4 py-2 rounded bg-black text-white border border-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleEmailSubmit}
            className="ml-2 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600"
          >
            Odeslat
          </button>
        </div>
      </div>
    </div>
  );
}
