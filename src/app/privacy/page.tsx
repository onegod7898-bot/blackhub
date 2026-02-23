import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Privacy Policy | BlackHub',
  description: 'BlackHub privacy policy and data handling practices',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

        <section className="space-y-6 text-foreground">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">BlackHub (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains how we collect, use, store, and protect your personal data when you use our Platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Data We Collect</h2>
            <p className="text-muted-foreground">We collect: account information (email, password, profile details); usage data (pages viewed, actions taken); payment data (processed by Paystack; we do not store card numbers); and communications (messages between buyers and sellers).</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Data</h2>
            <p className="text-muted-foreground">We use your data to: provide and improve the Platform; process payments; send transactional emails (confirmations, receipts); send optional marketing (if consented); detect fraud; and comply with legal obligations.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Third-Party Services</h2>
            <p className="text-muted-foreground">We use: Supabase (database, auth); Paystack (payments); Firebase (analytics); Resend (email); and hosting providers. Each has its own privacy policy. We do not sell your data to third parties.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground">We use essential cookies for authentication and session management. We may use analytics cookies to understand usage. See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
            <p className="text-muted-foreground">We retain account data while your account is active and for a reasonable period after deletion for legal and operational purposes. You may request deletion by contacting us.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-muted-foreground">You may: access and correct your data; request deletion; object to processing; withdraw consent; and lodge a complaint with a supervisory authority. Contact us to exercise these rights.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Security</h2>
            <p className="text-muted-foreground">We use industry-standard measures to protect your data, including encryption and secure access controls. No system is 100% secure; you use the Platform at your own risk.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Children</h2>
            <p className="text-muted-foreground">The Platform is not intended for users under 18. We do not knowingly collect data from children. If you believe we have collected such data, contact us to request deletion.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
            <p className="text-muted-foreground">For privacy inquiries, see our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
