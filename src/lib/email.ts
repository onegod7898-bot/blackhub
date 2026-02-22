// Email sending via Resend - server-side only
import { Resend } from 'resend'
import {
  getWelcomeEmailHtml,
  getTrialReminderDay5Html,
  getTrialReminderDay6Html,
  getSubscriptionConfirmationHtml,
  getSubscriptionRenewalReminderHtml,
  type EmailTemplateType,
} from './email-templates'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL || 'BlackHub <noreply@blackhubapp.com>'

export async function sendEmail(
  to: string,
  templateType: EmailTemplateType,
  extra?: { name?: string; plan?: string }
): Promise<{ ok: boolean; error?: string }> {
  if (!resend) return { ok: false, error: 'Resend not configured' }

  let subject: string
  let html: string

  switch (templateType) {
    case 'welcome':
      ({ subject, html } = getWelcomeEmailHtml(extra?.name))
      break
    case 'trial_reminder_day5':
      ({ subject, html } = getTrialReminderDay5Html(extra?.name))
      break
    case 'trial_reminder_day6':
      ({ subject, html } = getTrialReminderDay6Html(extra?.name))
      break
    case 'subscription_confirmation':
      ({ subject, html } = getSubscriptionConfirmationHtml(extra?.plan || 'starter'))
      break
    case 'subscription_renewal_reminder':
      ({ subject, html } = getSubscriptionRenewalReminderHtml())
      break
    default:
      return { ok: false, error: 'Unknown template type' }
  }

  const { error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) return { ok: false, error: String(error) }
  return { ok: true }
}
