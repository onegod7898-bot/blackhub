import { NextRequest, NextResponse } from 'next/server'
import { paystackRequest } from '@/lib/paystack'
import { createClient } from '@supabase/supabase-js'
import { PLANS, type PlanKey } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  try {
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

    const { plan, currency = 'NGN' } = await request.json()
    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planConfig = PLANS[plan as PlanKey]
    const isNgn = currency.toUpperCase() === 'NGN'
    const amountSmallest = isNgn ? planConfig.ngn : planConfig.usd
    const currencyCode = isNgn ? 'NGN' : 'USD'

    const planCode = process.env[`PAYSTACK_PLAN_${plan.toUpperCase()}_${currencyCode}`]

    const body: Record<string, unknown> = {
      email: user.email!,
      currency: currencyCode,
      callback_url: `${request.nextUrl.origin}/success?subscription=1`,
      metadata: {
        userId: user.id,
        type: 'subscription',
        plan,
        currency: currencyCode,
      },
    }
    if (planCode) {
      body.plan = planCode
    } else {
      body.amount = amountSmallest
    }

    const response = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const { data } = response

    await supabase.from('checkout_sessions').insert({
      user_id: user.id,
      session_id: data.reference,
      status: 'pending',
    })

    return NextResponse.json({
      authorizationUrl: data.authorization_url,
      reference: data.reference,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
