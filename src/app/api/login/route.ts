import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase
      .from("email")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data || !data.users) {
      return NextResponse.json({ error: "Uživatel nenalezen." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, data.users);
    if (!valid) {
      return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login chyba:", err);
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
