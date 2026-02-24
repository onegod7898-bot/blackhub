import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL || 'BlackHub <noreply@blackhubapp.com>'
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.RESEND_FROM_EMAIL || 'support@blackhubapp.com'

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json()
    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Email, subject, and message are required' }, { status: 400 })
    }
    if (typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    if (!resend) {
      return NextResponse.json({ error: 'Contact form not configured. Please email us directly.' }, { status: 503 })
    }

    const toEmail = (SUPPORT_EMAIL.match(/<([^>]+)>/) || [null, SUPPORT_EMAIL])[1]?.trim() || SUPPORT_EMAIL
    const html = `
      <h2>Contact Form Submission</h2>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `

    const { error } = await resend.emails.send({
      from: FROM,
      to: toEmail,
      replyTo: email,
      subject: `[BlackHub Contact] ${subject}`,
      html,
    })

    if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to send' }, { status: 500 })
  }
}
