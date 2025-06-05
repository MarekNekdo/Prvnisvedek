// src/app/api/send/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Neplatný e-mail." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "info@nasestrana.cz",
      to: email,
      subject: "Vítej na cestě světla",
      html: `
        <p>Děkuji ti za důvěru. Jsi na cestě k pravdě.</p>
        <p>Stáhni si zdarma Genesis 2.0 a Nové Desatero. A pokud tě bude zajímat víc, tak budu čekat.:</p>
        <a href="https://www.onlinerestart.cz">onlinerestart.cz</a>
        <p>Nebo se staň členem světla pro hlubší spojení. A společně najdeme pravdu.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Nepodařilo se odeslat e-mail." }, { status: 500 });
  }
}
