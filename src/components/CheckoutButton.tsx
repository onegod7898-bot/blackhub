'use client'

import { useState } from 'react'

interface CheckoutButtonProps {
  amount: number // Amount in main currency unit (e.g., 1000 for NGN 1000.00)
  email: string
  userId?: string
  currency?: string // Default: 'NGN', can be 'USD', 'GHS', 'ZAR', etc.
  metadata?: Record<string, any>
}

export default function CheckoutButton({
  amount,
  email,
  userId,
  currency = 'NGN',
  metadata,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!email) {
      alert('Please provide your email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email,
          userId,
          currency,
          metadata,
        }),
      })

      const data = await response.json()

      if (data.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl
      } else {
        throw new Error(data.error || 'Failed to initialize payment')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !email}
      className="btn-primary px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading ? 'Processing...' : 'Pay with Paystack'}
    </button>
  )
}
