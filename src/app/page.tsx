'use client'

import ProductList from '@/components/ProductList'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: 'Global reach',
    desc: 'Sell to buyers worldwide. NGN or USD. One platform.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    title: 'Analytics & insights',
    desc: 'Track revenue, customers, and growth. Data-driven decisions.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    ),
    title: 'Referral program',
    desc: 'Earn commission for every seller you invite.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    title: 'Verified sellers',
    desc: 'Trust badges for serious sellers.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero - Bold, clean, two CTAs, right mockup */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--muted)_0%,transparent_60%)]" />
        <Navbar transparent />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-foreground tracking-tight leading-[1.1] animate-fade-in">
                The marketplace for{' '}
                <span className="text-primary">global sellers</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed animate-fade-in-delay-1">
                List products. Get subscribers. Grow your business. 7-day free trial. No card required to start.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-delay-2">
                <Link
                  href="/signup"
                  className="btn-primary inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md hover:opacity-95"
                >
                  Start free trial
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary inline-flex items-center rounded-xl border border-border bg-background px-6 py-3.5 text-base font-semibold text-foreground"
                >
                  View pricing
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block animate-fade-in-delay-2">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl overflow-hidden">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 rounded-xl bg-muted h-32" />
                  <div className="flex-1 rounded-xl bg-muted h-32" />
                  <div className="flex-1 rounded-xl bg-muted h-32" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 rounded-lg bg-muted w-3/4" />
                  <div className="h-4 rounded-lg bg-muted w-1/2" />
                  <div className="h-8 rounded-lg bg-primary/20 w-1/4 mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Built for growth</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Everything you need to run a professional subscription marketplace.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-elevated rounded-xl bg-card p-6 ${i === 0 ? 'animate-fade-in-delay-1' : i === 1 ? 'animate-fade-in-delay-2' : 'animate-fade-in-delay-3'}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Featured Products</h2>
        <ProductList />
      </section>
      <BottomNav />
    </main>
  )
}
