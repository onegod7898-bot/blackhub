'use client'

import ProductList from '@/components/ProductList'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24 animate-fade-in">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">Terms</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">Privacy</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <ThemeToggle />
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
              <Link href="/signup" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Featured Products</h2>
        <ProductList />
      </div>
      <BottomNav />
    </main>
  )
}
