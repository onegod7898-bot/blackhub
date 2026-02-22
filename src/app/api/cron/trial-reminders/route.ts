import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmailIfNotSent } from '@/lib/send-email-if-needed'
import { sendPushTrialExpiring } from '@/lib/notifications'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: NextRequest) {
  if (CRON_SECRET && request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!supabaseAdmin) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })

  const now = new Date()
  // Day 5 of trial = 2 days left; Day 6 = 1 day left
  const in2Days = new Date(now); in2Days.setDate(in2Days.getDate() + 2); in2Days.setHours(0, 0, 0, 0)
  const in2DaysEnd = new Date(in2Days); in2DaysEnd.setHours(23, 59, 59, 999)
  const in1Day = new Date(now); in1Day.setDate(in1Day.getDate() + 1); in1Day.setHours(0, 0, 0, 0)
  const in1DayEnd = new Date(in1Day); in1DayEnd.setHours(23, 59, 59, 999)

  let sent5 = 0, sent6 = 0
  const { data: subs } = await supabaseAdmin.from('subscriptions').select('user_id, trial_ends_at').eq('status', 'trialing').not('trial_ends_at', 'is', null)

  for (const sub of subs || []) {
    const te = new Date(sub.trial_ends_at)
    if (te >= in2Days && te <= in2DaysEnd) {
      const { data: p } = await supabaseAdmin.from('profiles').select('email, display_name, company_name').eq('id', sub.user_id).single()
      if (p?.email) {
        await sendEmailIfNotSent(sub.user_id, p.email, 'trial_reminder_day5', { name: (p.display_name || p.company_name) as string })
        await sendPushTrialExpiring(sub.user_id, 2)
        sent5++
      }
    } else if (te >= in1Day && te <= in1DayEnd) {
      const { data: p } = await supabaseAdmin.from('profiles').select('email, display_name, company_name').eq('id', sub.user_id).single()
      if (p?.email) {
        await sendEmailIfNotSent(sub.user_id, p.email, 'trial_reminder_day6', { name: (p.display_name || p.company_name) as string })
        await sendPushTrialExpiring(sub.user_id, 1)
        sent6++
      }
    }
  }
  return NextResponse.json({ trial_reminder_day5: sent5, trial_reminder_day6: sent6 })
}
