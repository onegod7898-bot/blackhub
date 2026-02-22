import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmailIfNotSent } from '@/lib/send-email-if-needed'

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

    const role = (user.user_metadata?.role as string) || 'buyer'
    const country = (user.user_metadata?.country as string) || 'NG'

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    await supabaseAdmin.from('profiles').upsert({
      id: user.id,
      email: user.email,
      role: ['seller', 'buyer'].includes(role) ? role : 'buyer',
      country: ['NG', 'INT'].includes(country) ? country : 'NG',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    if (role === 'seller') {
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 7)
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: user.id,
        plan: 'starter',
        status: 'trialing',
        trial_ends_at: trialEndsAt.toISOString(),
        payment_provider: 'paystack',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    }

    if (user.email) {
      const { data: prof } = await supabaseAdmin.from('profiles').select('display_name, company_name').eq('id', user.id).single()
      const name = (prof?.display_name || prof?.company_name) as string | undefined
      sendEmailIfNotSent(user.id, user.email, 'welcome', { name }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
