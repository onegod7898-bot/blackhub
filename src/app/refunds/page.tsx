import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Refund Policy | BlackHub',
  description: 'BlackHub refund and cancellation policy',
}

export default function RefundsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB')
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-6">Refund Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: {lastUpdated}</p>
        <section className="space-y-6 text-foreground">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Subscription Fees</h2>
            <p className="text-muted-foreground">Subscription fees are generally non-refundable. Cancel anytime; access continues until end of billing period. No partial refunds.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Free Trial</h2>
            <p className="text-muted-foreground">7-day trial requires no payment. If charged in error, contact us within 7 days.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Product Purchases</h2>
            <p className="text-muted-foreground">Product refunds are between buyer and seller. Contact the seller directly.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Exceptions</h2>
            <p className="text-muted-foreground">We may refund duplicate charges or technical failures. Request via <Link href="/contact" className="text-primary hover:underline">Contact</Link>.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Processing</h2>
            <p className="text-muted-foreground">Refunds processed via Paystack. Allow 5-10 business days.</p>
          </div>
        </section>
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
