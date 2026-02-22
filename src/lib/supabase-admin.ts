// Server-only: use for admin operations (e.g. updating subscriptions from webhook/verify)
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
// Service role is optional; if missing, subscription activation in verify-payment may fail without it
export const supabaseAdmin = serviceRole
  ? createClient(url, serviceRole, { auth: { persistSession: false } })
  : null
