import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = { title: 'Terms and Conditions | BlackHub', description: 'BlackHub terms of service' }

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms and Conditions</h1>
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance</h2>
            <p className="text-muted-foreground">By using BlackHub you agree to these Terms. If you do not agree, do not use the Platform.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Service</h2>
            <p className="text-muted-foreground">BlackHub is a subscription marketplace connecting buyers and sellers. Sellers subscribe to list products; buyers browse and purchase. Transactions are between users.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Accounts</h2>
            <p className="text-muted-foreground">Provide accurate information. You must be 18 or older. Keep your credentials secure.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Seller Obligations</h2>
            <p className="text-muted-foreground">Sellers must comply with laws, describe products accurately, fulfil orders, and maintain a valid subscription.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Subscriptions</h2>
            <p className="text-muted-foreground">Billed via Paystack. Cancel anytime; access continues until end of billing period. Refunds per <Link href="/refunds" className="text-primary hover:underline">Refund Policy</Link>.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Prohibited Conduct</h2>
            <p className="text-muted-foreground">No illegal use, prohibited items, misrepresentation, harassment, or fee circumvention.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Liability</h2>
            <p className="text-muted-foreground">Our liability is limited to fees paid in the prior 12 months. No indirect or consequential damages.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
            <p className="text-muted-foreground">Questions? See <Link href="/contact" className="text-primary hover:underline">Contact</Link>.</p>
          </div>
        </section>
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
