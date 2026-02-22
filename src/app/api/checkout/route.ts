import { NextRequest, NextResponse } from 'next/server'
import { paystackRequest } from '@/lib/paystack'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { amount, email, userId, currency = 'NGN', metadata } = await request.json()

    // Amount is in main currency unit (e.g., 1000 for NGN 1000.00)
    // Paystack requires amount in smallest currency unit (kobo for NGN, cents for USD, etc.)
    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      )
    }

    // Initialize Paystack transaction
    const response = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo/cents (smallest currency unit)
        currency: currency.toUpperCase(), // NGN, USD, GHS, ZAR, etc.
        callback_url: `${request.nextUrl.origin}/success`,
        metadata: {
          userId: userId || 'anonymous',
          ...metadata,
        },
      }),
    })

    const { data } = response

    // Save transaction reference to Supabase
    if (userId) {
      await supabase.from('checkout_sessions').insert({
        user_id: userId,
        session_id: data.reference, // Paystack uses 'reference' instead of 'session_id'
        status: 'pending',
      })
    }

    return NextResponse.json({
      authorizationUrl: data.authorization_url,
      accessCode: data.access_code,
      reference: data.reference,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
