import { NextRequest, NextResponse } from 'next/server'
import { paystackRequest } from '@/lib/paystack'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    // Verify transaction with Paystack
    const response = await paystackRequest(`/transaction/verify/${reference}`)

    const { data } = response

    // Update checkout session in Supabase
    if (data.status === 'success') {
      await supabase
        .from('checkout_sessions')
        .update({ status: 'completed' })
        .eq('session_id', reference)

      // If this was a subscription payment, activate subscription (use admin client to bypass RLS)
      const meta = data.metadata || {}
      if (meta.type === 'subscription' && meta.userId && meta.plan) {
        const periodEnd = new Date()
        const months = meta.billing === 'yearly' ? 12 : 1
        periodEnd.setMonth(periodEnd.getMonth() + months)
        const client = supabaseAdmin || supabase
        await client
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
      }
    }

    return NextResponse.json({
      status: data.status,
      message: data.gateway_response,
      amount: data.amount / 100, // Convert back from kobo/cents
      currency: data.currency,
      reference: data.reference,
      customer: data.customer,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
