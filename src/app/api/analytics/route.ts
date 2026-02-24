import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'seller') {
    return NextResponse.json({ revenue: 0, customers: 0, salesCount: 0, chartData: [], transactions: [] })
  }

  // Listings count
  const { count: listingsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', user.id)

  // Revenue & sales: placeholder until product sales table exists
  const revenueCents = 0
  const salesCount = 0

  // Chart: last 7 days (placeholder trend)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().slice(0, 10),
      revenue: Math.floor(10 + i * 5 + Math.random() * 20),
    }
  })

  // Recent transactions (from checkout_sessions - simplified)
  const { data: sessions } = await supabase
    .from('checkout_sessions')
    .select('session_id, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const transactions = (sessions || []).map((s) => ({
    id: s.session_id,
    status: s.status,
    date: s.created_at,
    amount: '-',
  }))

  return NextResponse.json({
    revenue: revenueCents / 100,
    customers: listingsCount || 0,
    salesCount,
    chartData,
    transactions,
  })
}
