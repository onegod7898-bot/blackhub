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

  // Revenue & sales from orders (run migration 005_orders.sql if table missing)
  const { data: ordersData } = await supabase.from('orders').select('amount_cents, created_at').eq('seller_id', user.id).in('status', ['paid', 'completed'])
  const orders = ordersData || []

  const revenueCents = orders.reduce((s, o) => s + (o.amount_cents || 0), 0)
  const salesCount = orders.length

  // Chart: last 7 days revenue
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toISOString().slice(0, 10)
    const dayRevenue = orders.filter((o) => o.created_at?.startsWith(dayStr)).reduce((s, o) => s + (o.amount_cents || 0) / 100, 0)
    return { date: dayStr, revenue: Math.round(dayRevenue * 100) / 100 }
  })

  // Recent transactions: orders + checkout_sessions
  const { data: orderListData } = await supabase.from('orders').select('id, status, amount_cents, created_at').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5)
  const orderList = orderListData || []

  const { data: sessions } = await supabase
    .from('checkout_sessions')
    .select('session_id, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const orderTx = (orderList as { id: string; status: string; amount_cents?: number; created_at: string }[]).map((o) => ({
    id: o.id,
    status: o.status,
    date: o.created_at,
    amount: `$${((o.amount_cents ?? 0) / 100).toFixed(2)}`,
  }))
  const sessionTx = (sessions || []).map((s) => ({
    id: s.session_id,
    status: s.status,
    date: s.created_at,
    amount: '-',
  }))
  const transactions = [...orderTx, ...sessionTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  return NextResponse.json({
    revenue: revenueCents / 100,
    customers: listingsCount || 0,
    salesCount,
    chartData,
    transactions,
  })
}
