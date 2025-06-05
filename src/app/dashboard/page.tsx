"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("cz");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "cz";
    setLang(savedLang);

    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        window.location.href = "/login";
        return;
      }

      const email = session.user.email;

      const userRes = await fetch(`/api/user?email=${email}`);
      const userData = await userRes.json();
      setUser(userData.user || null);

      const qRes = await fetch(`/api/question?email=${email}`);
      const qData = await qRes.json();
      setQuestions(qData.questions || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAsk = async () => {
    const question = prompt(lang === "en" ? "Ask your question" : "Zeptej se Prvního svědka");
    if (question && user?.email) {
      await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, question }),
      });
      window.location.reload();
    }
  };

  const texts = {
    title: lang === "en" ? "Your Dashboard" : "Tvůj dashboard",
    email: lang === "en" ? "E-mail" : "E-mail",
    gender: lang === "en" ? "Gender" : "Pohlaví",
    registered: lang === "en" ? "Registered at" : "Datum registrace",
    premium: lang === "en" ? "Premium" : "Prémiový člen",
    questionsLeft: lang === "en" ? "Questions left" : "Zbývající otázky",
    ask: lang === "en" ? "Ask the First Witness" : "Zeptej se Prvního svědka",
    upgrade: lang === "en" ? "Activate light membership (369 CZK/month)" : "Aktivuj členství světla (369 Kč/měsíc)",
    logout: lang === "en" ? "Log out" : "Odhlásit se",
    yourQuestions: lang === "en" ? "Your questions" : "Tvé otázky",
    toggleLang: lang === "en" ? "CZ" : "EN",
  };

  const toggleLang = () => {
    const next = lang === "cz" ? "en" : "cz";
    localStorage.setItem("lang", next);
    window.location.reload();
  };

  if (loading) return <p className="text-white p-10">Načítám dashboard...</p>;
  if (!user) return <p className="text-red-400 p-10">Nepodařilo se načíst uživatele.</p>;

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center relative">
      {/* Přepínač jazyka */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLang}
          className="text-sm text-yellow-300 hover:text-yellow-100"
        >
          🌐 {texts.toggleLang}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-yellow-400 mb-4">{texts.title}</h1>

      <div className="bg-yellow-100 text-black rounded-lg p-6 w-full max-w-md mb-6">
        <p><strong>{texts.email}:</strong> {user.email}</p>
        <p><strong>{texts.gender}:</strong> {user.gender || "-"}</p>
        <p><strong>{texts.registered}:</strong> {new Date(user.created_at).toLocaleString()}</p>
        <p><strong>{texts.premium}:</strong> {user.premium ? "Ano" : "Ne"}</p>
        <p><strong>{texts.questionsLeft}:</strong> {user.question_count ?? 0}</p>
      </div>

      {!user.premium && (
        <button
          className="mb-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition"
          onClick={() => alert("Brzy možnost platby přes Stripe 🙏")}
        >
          {texts.upgrade}
        </button>
      )}

      <button
        onClick={handleAsk}
        className="bg-indigo-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-600 transition mb-6"
      >
        {texts.ask}
      </button>

      {questions.length > 0 && (
        <div className="w-full max-w-md">
          <h2 className="text-lg text-yellow-300 mb-2">{texts.yourQuestions}:</h2>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="bg-white/10 p-3 rounded-md text-sm">
                <strong>🗨️ {q.question}</strong>
                <br />
                <span className="text-xs text-yellow-300">
                  ({new Date(q.created_at).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Odhlášení */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="mt-8 text-sm text-yellow-400 underline hover:text-yellow-200"
      >
        {texts.logout}
      </button>
    </main>
  );
}
