
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient | undefined
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const db =
  globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseKey)

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabase = db
