import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CEO_EMAIL = process.env.NEXT_PUBLIC_CEO_EMAIL || process.env.CEO_EMAIL

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.slice(7)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user || user.email !== CEO_EMAIL) {
    return NextResponse.json({ error: 'Forbidden: CEO only' }, { status: 403 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 })
  }

  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name, company_name, role, country, suspended, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ users: users || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
