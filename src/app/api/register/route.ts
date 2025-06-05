// app/api/register/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()
  const { email, gender } = body

  if (!email) {
    return NextResponse.json({ error: 'Email je povinný.' }, { status: 400 })
  }

  // 🔍 Kontrola, jestli e-mail už existuje
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    return NextResponse.json({ error: 'Tento e-mail je již registrován.' }, { status: 409 })
  }

  // ✅ Vložení nového uživatele
  const { error } = await supabase
    .from('users')
    .insert([{ email, gender }])

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
