import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use placeholder when env vars missing so build/runtime never crashes (e.g. Vercel without env)
const supabase: SupabaseClient = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-anon-key'
)
export { supabase }
