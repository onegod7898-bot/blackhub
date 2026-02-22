'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const isSubscription = searchParams.get('subscription') === '1'
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    if (reference) {
      verifyPayment(reference)
    } else {
      setLoading(false)
    }
  }, [reference])

  const verifyPayment = async (ref: string) => {
    try {
      const response = await fetch(`/api/verify-payment?reference=${ref}`)
      const data = await response.json()

      if (data.status === 'success') {
        setPaymentData(data)
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <p className="text-muted-foreground">Verifying payment...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-2">
          {isSubscription ? 'Your subscription is now active.' : 'Thank you for your purchase.'}
        </p>
        {paymentData && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-foreground">
              Amount: {paymentData.currency} {paymentData.amount?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Reference: {paymentData.reference}
            </p>
          </div>
        )}
        {reference && !paymentData && (
          <p className="text-sm text-gray-500 mt-2">
            Reference: {reference}
          </p>
        )}
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/dashboard" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Go to Dashboard
          </Link>
          <Link href="/" className="px-6 py-3 border border-border rounded-lg hover:bg-muted">
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <p className="text-muted-foreground">Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
