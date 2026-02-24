import { NextRequest, NextResponse } from 'next/server'
import { sendEmailIfNotSent } from '@/lib/send-email-if-needed'
import { sendPushSubscriptionSuccess } from '@/lib/notifications'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-paystack-signature')
  if (!signature || !PAYSTACK_SECRET) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }

  const crypto = await import('crypto')
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(body).digest('hex')
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body) as { event: string; data: Record<string, unknown> }
  const supabaseAdmin = (await import('@/lib/supabase-admin')).supabaseAdmin
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true })
  }

  try {
    if (event.event === 'charge.success') {
      const data = event.data as {
        metadata?: { userId?: string; plan?: string; type?: string; billing?: string }
        reference?: string
        amount?: number
        currency?: string
      }
      const meta = data.metadata || {}
      if (meta.type === 'subscription' && meta.userId && meta.plan) {
        const periodEnd = new Date()
        const months = meta.billing === 'yearly' ? 12 : 1
        periodEnd.setMonth(periodEnd.getMonth() + months)
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            plan: meta.plan,
            current_period_ends_at: periodEnd.toISOString(),
            renewal_date: periodEnd.toISOString(),
            payment_provider: 'paystack',
            paystack_reference: data.reference,
            amount_cents: data.amount,
            currency: data.currency || 'NGN',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', meta.userId)

        const { data: u } = await supabaseAdmin.from('profiles').select('email').eq('id', meta.userId).single()
        if (u?.email) {
          sendEmailIfNotSent(meta.userId, u.email, 'subscription_confirmation', { plan: meta.plan }).catch(() => {})
        }
        sendPushSubscriptionSuccess(meta.userId, meta.plan).catch(() => {})

        const { data: prof } = await supabaseAdmin.from('profiles').select('referred_by').eq('id', meta.userId).single()
        if (prof?.referred_by && data.amount) {
          const commissionCents = Math.max(500, Math.round((data.amount || 0) * 0.1))
          await supabaseAdmin.from('referral_earnings').insert({
            referrer_id: prof.referred_by,
            referred_id: meta.userId,
            amount_cents: commissionCents,
            source: 'subscription',
          })
          const { data: refProf } = await supabaseAdmin.from('profiles').select('referral_earnings_cents').eq('id', prof.referred_by).single()
          const current = (refProf?.referral_earnings_cents || 0) + commissionCents
          await supabaseAdmin.from('profiles').update({ referral_earnings_cents: current, updated_at: new Date().toISOString() }).eq('id', prof.referred_by)
        }
      }
    }

  } catch {
    // log but don't fail webhook
  }

  return NextResponse.json({ received: true })
}
