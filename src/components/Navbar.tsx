'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

interface NavbarProps {
  transparent?: boolean
  showAuth?: boolean
}

export default function Navbar({ transparent = false, showAuth = true }: NavbarProps) {
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'glass border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hidden sm:inline">Terms</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hidden sm:inline">Privacy</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Pricing</Link>
            <ThemeToggle />
            {showAuth && (
              <>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Log in</Link>
                <Link href="/signup" className="btn-saas rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-primary/25">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
