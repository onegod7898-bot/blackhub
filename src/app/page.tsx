'use client'

import ProductList from '@/components/ProductList'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">Terms</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">Privacy</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
          <Link href="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Featured Products</h2>
        <ProductList />
      </div>
      <BottomNav />
    </main>
  )
}
