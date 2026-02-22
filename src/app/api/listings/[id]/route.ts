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

type SubRow = { status: string; trial_ends_at: string | null; current_period_ends_at: string | null }

async function hasActiveSubscription(supabase: NonNullable<ReturnType<typeof getSupabaseWithAuth>>, userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at, current_period_ends_at')
    .eq('user_id', userId)
    .single()
  if (!data) return false
  const d = data as SubRow
  if (d.status === 'trialing' && d.trial_ends_at && new Date() <= new Date(d.trial_ends_at)) return true
  if (d.status === 'active') {
    if (!d.current_period_ends_at) return true
    return new Date() <= new Date(d.current_period_ends_at)
  }
  return false
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ error: 'Subscription required to edit. Trial expired or no active plan.' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from('products')
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.image_url !== undefined && { image_url: body.image_url }),
      ...(body.category !== undefined && { category: body.category }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('seller_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listing: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseWithAuth(request)
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')!.slice(7))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
