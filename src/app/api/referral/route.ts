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

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, referral_earnings_cents')
    .eq('id', user.id)
    .single()

  let referralCode = profile?.referral_code
  if (!referralCode) {
    referralCode = 'BH' + Math.random().toString(36).slice(2, 10).toUpperCase()
    await supabase.from('profiles').update({ referral_code: referralCode, updated_at: new Date().toISOString() }).eq('id', user.id)
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blackhub.vercel.app'
  const referralLink = `${baseUrl}/signup?ref=${referralCode}`

  const { data: earnings } = await supabase
    .from('referral_earnings')
    .select('amount_cents, source, created_at')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const totalEarnings = (profile?.referral_earnings_cents || 0) / 100

  return NextResponse.json({
    referralCode,
    referralLink,
    totalEarnings,
    earnings: (earnings || []).map((e) => ({
      amount: e.amount_cents / 100,
      source: e.source,
      date: e.created_at,
    })),
  })
}
