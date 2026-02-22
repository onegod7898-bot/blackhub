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
  const { push_subscription, platform = 'web' } = body as {
    push_subscription: string | Record<string, unknown>
    platform?: 'web' | 'expo_android' | 'expo_ios'
  }
  if (!push_subscription) {
    return NextResponse.json({ error: 'push_subscription required' }, { status: 400 })
  }

  const tokenStr = typeof push_subscription === 'string'
    ? push_subscription
    : JSON.stringify(push_subscription)

  const { error } = await supabase.from('push_tokens').upsert(
    {
      user_id: user.id,
      token: tokenStr,
      platform: ['web', 'expo_android', 'expo_ios'].includes(platform) ? platform : 'web',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,token' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabaseWithAuth(request)
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = request.headers.get('authorization')!.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { push_subscription } = body as { push_subscription?: string | Record<string, unknown> }
  const tokenStr = push_subscription
    ? (typeof push_subscription === 'string' ? push_subscription : JSON.stringify(push_subscription))
    : null

  if (tokenStr) {
    await supabase.from('push_tokens').delete().eq('user_id', user.id).eq('token', tokenStr)
  } else {
    await supabase.from('push_tokens').delete().eq('user_id', user.id)
  }

  return NextResponse.json({ ok: true })
}
