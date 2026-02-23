import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-10 px-4 mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/refunds" className="hover:text-foreground transition-colors">Refunds</Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© {new Date().getFullYear()} BlackHub. Connect. Sell. Grow.</p>
      </div>
    </footer>
  )
}
