import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseWithAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseWithAuth(request)
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = request.headers.get('authorization')!.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { message_id } = body
  if (!message_id) return NextResponse.json({ error: 'message_id required' }, { status: 400 })

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', message_id)
    .eq('receiver_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
