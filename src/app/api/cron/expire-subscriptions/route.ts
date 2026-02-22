import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/** Call from Vercel Cron or similar to mark expired subscriptions as past_due */
const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: NextRequest) {
  if (CRON_SECRET && request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  try {
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'past_due', updated_at: now })
      .eq('status', 'active')
      .lt('current_period_ends_at', now)
      .select('id')

    if (error) throw error
    return NextResponse.json({ expired: data?.length ?? 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
