'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ContactSellerFormProps {
  productId: string
  productName: string
  sellerId: string
}

export default function ContactSellerForm({ productId, productName, sellerId }: ContactSellerFormProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { session: s } } = await supabase.auth.getSession()
    if (!s) {
      setError('Please log in to contact the seller')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s.access_token}`,
        },
        body: JSON.stringify({
          receiver_id: sellerId,
          product_id: productId,
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSent(true)
      setMessage('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground mb-2">Contact Seller</h3>
      {sent ? (
        <p className="text-green-600 dark:text-green-400 text-sm mb-4">Message sent! The seller will reply via Messages.</p>
      ) : (
        <>
          <p className="text-muted-foreground text-sm mb-4">Send a message about &quot;{productName}&quot;</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              maxLength={2000}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </>
      )}
      {session === false && (
        <Link href="/login" className="block text-sm text-primary mt-2 hover:underline">
          Log in to message sellers
        </Link>
      )}
    </div>
  )
}
