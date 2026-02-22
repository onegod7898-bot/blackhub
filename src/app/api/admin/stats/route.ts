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
    // Total users (from auth.users we can't query directly with anon; use profiles as proxy)
    const { count: totalUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true })
    const { count: totalSellers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller')

    // Subscriptions
    const { data: subs } = await supabaseAdmin.from('subscriptions').select('id, status, plan, amount_cents, currency, created_at, trial_ends_at, current_period_ends_at')
    const now = new Date()
    const activeSubscriptions = subs?.filter((s) => {
      if (s.status === 'trialing' && s.trial_ends_at && new Date(s.trial_ends_at) >= now) return true
      if (s.status === 'active' && (!s.current_period_ends_at || new Date(s.current_period_ends_at) >= now)) return true
      return false
    })?.length ?? 0
    const trialing = subs?.filter((s) => s.status === 'trialing')?.length ?? 0
    const revenueCents = subs?.filter((s) => s.status === 'active' && s.amount_cents).reduce((sum, s) => sum + (s.amount_cents || 0), 0) ?? 0

    // Growth: new signups last 7 days (use profiles or subscriptions created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoIso = weekAgo.toISOString()
    const { count: newUsersThisWeek } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgoIso)

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalSellers: totalSellers ?? 0,
      activeSubscriptions,
      trialing,
      revenueCents,
      newUsersLast7Days: newUsersThisWeek ?? 0,
      subscriptions: subs?.length ?? 0,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
