// BlackHub email templates - dark theme, branded HTML

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://blackhubapp.com'
const APP_NAME = 'BlackHub'

const baseStyles = `body{font-family:-apple-system,sans-serif;margin:0;padding:0;background:#0f0f0f;color:#e5e5e5}.container{max-width:560px;margin:0 auto;padding:40px 24px}.card{background:#1a1a1a;border-radius:16px;padding:32px;border:1px solid #333}.btn{display:inline-block;background:#6366f1;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0}.muted{color:#a3a3a3;font-size:14px}h1{margin:0 0 16px;font-size:24px}p{margin:0 0 12px;line-height:1.6}.footer{margin-top:32px;padding-top:24px;border-top:1px solid #333;color:#737373;font-size:12px}`

function wrap(content: string, subject: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${subject}</title><style>${baseStyles}</style></head><body><div class="container">${content}</div></body></html>`
}

export function getWelcomeEmailHtml(name?: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name}` : 'Hi'
  const content = `<div class="card"><h1>Welcome to ${APP_NAME}</h1><p>${greeting},</p><p>Your account has been created. Start exploring products or list your own if you're a seller.</p><a href="${APP_URL}" class="btn">Go to ${APP_NAME}</a><p class="muted">If you didn't create this account, you can ignore this email.</p></div><div class="footer">© ${new Date().getFullYear()} ${APP_NAME}.</div>`
  return { subject: `Welcome to ${APP_NAME}`, html: wrap(content, `Welcome to ${APP_NAME}`) }
}

export function getTrialReminderDay5Html(name?: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name}` : 'Hi'
  const content = `<div class="card"><h1>Your trial ends in 2 days</h1><p>${greeting},</p><p>Your BlackHub seller trial will expire soon. Subscribe to keep listing products.</p><a href="${APP_URL}/pricing" class="btn">View Plans</a></div><div class="footer">© ${new Date().getFullYear()} ${APP_NAME}.</div>`
  return { subject: 'Your BlackHub trial ends in 2 days', html: wrap(content, 'Trial reminder') }
}

export function getTrialReminderDay6Html(name?: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name}` : 'Hi'
  const content = `<div class="card"><h1>Your trial ends tomorrow</h1><p>${greeting},</p><p>Your BlackHub seller trial expires tomorrow. Subscribe now to avoid losing access.</p><a href="${APP_URL}/pricing" class="btn">Subscribe Now</a></div><div class="footer">© ${new Date().getFullYear()} ${APP_NAME}.</div>`
  return { subject: 'Your BlackHub trial ends tomorrow', html: wrap(content, 'Trial reminder') }
}

export function getSubscriptionConfirmationHtml(plan: string): { subject: string; html: string } {
  const content = `<div class="card"><h1>Subscription confirmed</h1><p>Your ${plan} plan is now active.</p><a href="${APP_URL}/dashboard" class="btn">Go to Dashboard</a></div><div class="footer">© ${new Date().getFullYear()} ${APP_NAME}.</div>`
  return { subject: 'BlackHub subscription confirmed', html: wrap(content, 'Subscription confirmed') }
}

export function getSubscriptionRenewalReminderHtml(): { subject: string; html: string } {
  const content = `<div class="card"><h1>Your subscription renews soon</h1><p>We will charge your saved payment method. No action needed.</p><a href="${APP_URL}/dashboard" class="btn">View Subscription</a></div><div class="footer">© ${new Date().getFullYear()} ${APP_NAME}.</div>`
  return { subject: 'BlackHub subscription renewal reminder', html: wrap(content, 'Renewal reminder') }
}

export type EmailTemplateType = 'welcome' | 'trial_reminder_day5' | 'trial_reminder_day6' | 'subscription_confirmation' | 'subscription_renewal_reminder'
