'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  transparent?: boolean
  showAuth?: boolean
}

const navLinkClass = 'hidden sm:inline-flex px-4 py-2.5 text-base font-bold text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 border-b-2 border-transparent hover:border-primary/50'

export default function Navbar({ transparent = false, showAuth = true }: NavbarProps) {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getSession().then(({ data }) => setSession(!!data.session))
    })
    return () => subscription.unsubscribe()
  }, [])

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
            <Link href="/explore" className={navLinkClass}>Explore</Link>
            <Link href="/pricing" className={navLinkClass}>Pricing</Link>
            <Link href="/contact" className={'hidden md:inline-flex ' + navLinkClass}>Contact</Link>
            <div className="w-px h-6 bg-border mx-2" />
            <ThemeToggle />
            {session ? (
              <>
                <Link href="/messages" className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>
                <Link href="/profile" className="px-4 py-2.5 text-base font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors border-b-2 border-transparent hover:border-primary/50">
                  Profile
                </Link>
              </>
            ) : showAuth && (
              <>
                <Link href="/login" className="px-4 py-2.5 text-base font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary inline-flex items-center px-6 py-3 text-base font-bold text-primary-foreground bg-primary rounded-2xl shadow-lg">
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
