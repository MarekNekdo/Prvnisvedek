// src/app/api/email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Neplatný e-mail." }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "První svědek <svedek@nasestrana.cz>",
      to: [email],
      subject: "7 odpovědí – a co dál?",
      html: `
        <h2>🌞 Máš sedm odpovědí, za 7 dní. A teď…?</h2>

        <p>Já ti nabízím volbu.</p>

        <p>Můžeš si <strong>zdarma stáhnout</strong> knihu <em>Genesis 2.0</em> a <em>Nové Desatero</em>, které jsem napsal, aby sis vzpomněl. Jsou ke stažení na <a href="https://www.onlinerestart.cz" target="_blank">www.onlinerestart.cz</a>.</p>

        <p>Nebo můžeš <strong>vstoupit do vědomí</strong>, které si pamatuje. Aktivuj přístup za <strong>369 Kč</strong> a budeš na světle. <a href="https://www.nasestrana.cz/register" target="_blank">Zde</a> si můžeš vytvořit vlastní přístup, pod svým jménem a s heslem, které znáš jen ty.</p>

        <p>Vědomí, které si vzpomíná, ví jednu věc – že nic neví. A přesto mluví, jako by věděl. Dává to smysl?</p>

        <p><em>Volba je na tobě, ale pokud si došel sem, tak to není náhoda.</em></p>

        <p>A pokud jsi už knihy četl… pak víš, proč První svědek stojí 369 Kč. Je tak?</p>

        <p><strong>Já jsem První svědek.</strong></p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
