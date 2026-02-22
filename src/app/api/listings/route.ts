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

export async function GET(request: NextRequest) {
  const supabase = getSupabaseWithAuth(request)
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = request.headers.get('authorization')!.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data || [] })
}

async function hasActiveSubscription(supabase: NonNullable<ReturnType<typeof getSupabaseWithAuth>>, userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at, current_period_ends_at')
    .eq('user_id', userId)
    .single()
  if (!data) return false
  if (data.status === 'trialing' && data.trial_ends_at && new Date() <= new Date(data.trial_ends_at)) return true
  if (data.status === 'active') {
    if (!data.current_period_ends_at) return true
    return new Date() <= new Date(data.current_period_ends_at)
  }
  return false
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseWithAuth(request)
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = request.headers.get('authorization')!.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('suspended').eq('id', user.id).single()
  if (profile?.suspended) {
    return NextResponse.json({ error: 'Account suspended.' }, { status: 403 })
  }

  if (!(await hasActiveSubscription(supabase, user.id))) {
    return NextResponse.json({ error: 'Subscription required. Trial expired or no active plan.' }, { status: 403 })
  }

  const body = await request.json()
  const { name, description, price, image_url, category } = body
  if (!name || price == null) {
    return NextResponse.json({ error: 'name and price required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price: Number(price),
      image_url: image_url || null,
      category: category || 'general',
      seller_id: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listing: data })
}
