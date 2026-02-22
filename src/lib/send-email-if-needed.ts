// Server-only: send email if not already sent (checks email_log)
import { supabaseAdmin } from './supabase-admin'
import { sendEmail } from './email'
import type { EmailTemplateType } from './email-templates'

export async function sendEmailIfNotSent(
  userId: string,
  email: string,
  templateType: EmailTemplateType,
  extra?: { name?: string; plan?: string }
): Promise<void> {
  if (!supabaseAdmin) return

  const { data: existing } = await supabaseAdmin
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('template_type', templateType)
    .single()

  if (existing) return

  const result = await sendEmail(email, templateType, extra)
  if (result.ok) {
    await supabaseAdmin.from('email_log').insert({
      user_id: userId,
      email,
      template_type: templateType,
    })
  }
}
