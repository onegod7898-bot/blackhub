import Link from 'next/link'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Cookie Policy | BlackHub',
  description: 'BlackHub cookie policy and usage',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-6">Cookie Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

        <section className="space-y-6 text-foreground">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. What Are Cookies</h2>
            <p className="text-muted-foreground">Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you logged in, and improve your experience.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Cookies We Use</h2>
            <p className="text-muted-foreground"><strong>Essential cookies:</strong> Required for the Platform to function. Include authentication (Supabase), session management, and theme preference. These cannot be disabled without affecting functionality.</p>
            <p className="text-muted-foreground mt-2"><strong>Analytics cookies:</strong> We use Firebase Analytics to understand how users interact with the Platform. This helps us improve the service. You can opt out via your browser settings or our consent banner where applicable.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground">Our providers (Supabase, Firebase, Paystack) may set cookies. Refer to their privacy policies for details. We do not control third-party cookies.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Managing Cookies</h2>
            <p className="text-muted-foreground">You can control cookies through your browser settings. Blocking essential cookies may prevent you from logging in or using certain features. For more on data handling, see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
            <p className="text-muted-foreground">For questions about cookies, see our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
