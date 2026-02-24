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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-background/80 backdrop-blur-xl border-b border-border/40' : 'nav-premium'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <Logo />
          <nav className="flex items-center gap-1">
            <Link
              href="/explore"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors duration-200"
            >
              Explore
            </Link>
            <Link
              href="/pricing"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors duration-200"
            >
              Contact
            </Link>
            <div className="w-px h-6 bg-border mx-2" />
            <ThemeToggle />
            {showAuth && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary inline-flex items-center px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-95 shadow-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
