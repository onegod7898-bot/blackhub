// Server-only: use for admin operations (e.g. updating subscriptions from webhook/verify)
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

// Do not throw at build time: Vercel may build without env vars. At runtime, routes check supabaseAdmin before use.
export const supabaseAdmin: SupabaseClient | null =
  url && serviceRole
    ? createClient(url, serviceRole, { auth: { persistSession: false } })
    : null
