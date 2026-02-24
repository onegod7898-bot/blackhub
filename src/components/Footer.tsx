import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <span className="font-semibold text-foreground text-lg tracking-tight">BlackHub</span>
          <nav className="flex flex-wrap gap-8 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Terms</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Privacy</Link>
            <Link href="/refunds" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Refunds</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Cookies</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Contact</Link>
          </nav>
        </div>
        <p className="mt-8 pt-8 border-t border-border text-center sm:text-left text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlackHub. Connect. Sell. Grow.
        </p>
      </div>
    </footer>
  )
}
