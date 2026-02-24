import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <span className="font-semibold text-foreground text-lg">BlackHub</span>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/refunds" className="text-muted-foreground hover:text-foreground transition-colors">Refunds</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </nav>
        </div>
        <p className="mt-8 pt-8 border-t border-border text-center sm:text-left text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlackHub. Connect. Sell. Grow.
        </p>
      </div>
    </footer>
  )
}
