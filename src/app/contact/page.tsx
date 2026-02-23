'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-2xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch for support, legal inquiries, or feedback.</p>

        <div className="space-y-8">
          <section className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Email</h2>
            <p className="text-muted-foreground mb-2">For general support, legal, and privacy inquiries:</p>
            <a href="mailto:support@blackhubapp.com" className="text-primary hover:underline font-medium">support@blackhubapp.com</a>
          </section>

          <section className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Send a Message</h2>
            {submitted ? (
              <p className="text-muted-foreground">Thank you for your message. We will get back to you as soon as possible.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <p className="text-sm text-muted-foreground">Note: This form is a placeholder. Connect it to your email service (e.g. Resend, Formspree) or use the email above directly.</p>
                <button type="submit" className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90">
                  Send Message
                </button>
              </form>
            )}
          </section>

          <section className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Legal Pages</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/terms" className="text-primary hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="text-primary hover:underline">Refund Policy</Link></li>
              <li><Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link></li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
