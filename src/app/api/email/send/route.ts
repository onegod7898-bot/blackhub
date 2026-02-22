import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'
import type { EmailTemplateType } from '@/lib/email-templates'

const TEMPLATE_TYPES: EmailTemplateType[] = [
  'welcome',
  'trial_reminder_day5',
  'trial_reminder_day6',
  'subscription_confirmation',
  'subscription_renewal_reminder',
]

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`

  if (!isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { user_email, user_id, template_type, name, plan } = body as {
    user_email: string
    user_id?: string
    template_type: EmailTemplateType
    name?: string
    plan?: string
  }

  if (!user_email || !template_type) {
    return NextResponse.json({ error: 'user_email and template_type required' }, { status: 400 })
  }
  if (!TEMPLATE_TYPES.includes(template_type)) {
    return NextResponse.json({ error: 'Invalid template_type' }, { status: 400 })
  }

  if (user_id && supabaseAdmin) {
    const { data: existing } = await supabaseAdmin
      .from('email_log')
      .select('id')
      .eq('user_id', user_id)
      .eq('template_type', template_type)
      .single()
    if (existing) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'already_sent' })
    }
  }

  const result = await sendEmail(user_email, template_type, { name, plan })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  if (user_id && supabaseAdmin) {
    await supabaseAdmin.from('email_log').insert({
      user_id,
      email: user_email,
      template_type,
    })
  }

  return NextResponse.json({ ok: true })
}
