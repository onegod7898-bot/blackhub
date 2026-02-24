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
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        transparent ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'nav-premium'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 lg:h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/pricing"
              className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/terms"
              className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              Privacy
            </Link>
            <div className="w-px h-5 bg-border mx-1" />
            <ThemeToggle />
            {showAuth && (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="btn-saas ml-1 inline-flex items-center px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:opacity-95 shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
