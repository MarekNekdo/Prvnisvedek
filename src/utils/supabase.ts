// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
console.log("URL:", supabaseUrl, "KEY:", supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
