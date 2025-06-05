import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { email, question } = await req.json()

  const { error } = await supabase
    .from('questions')
    .insert([{ email, question }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

// ⬇ Snížení počtu otázek o 1
const { data: userData, error: fetchError } = await supabase
  .from('users')
  .select('question_count')
  .eq('email', email)
  .single();

if (fetchError || !userData) {
  return NextResponse.json({ error: 'Nepodařilo se načíst uživatele.' }, { status: 500 });
}

const newCount = Math.max(0, (userData.question_count || 0) - 1);

await supabase
  .from('users')
  .update({ question_count: newCount })
  .eq('email', email);
  return NextResponse.json({ success: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ questions: data })
}
