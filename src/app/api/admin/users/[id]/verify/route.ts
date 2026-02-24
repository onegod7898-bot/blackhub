import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const CEO_EMAIL = process.env.NEXT_PUBLIC_CEO_EMAIL || process.env.CEO_EMAIL

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const verified = body.verified === true

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ verified_seller: verified, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, verified })
}
