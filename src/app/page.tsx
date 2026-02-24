'use client'

import ProductList from '@/components/ProductList'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

const FEATURES = [
  {
    icon: '🌍',
    title: 'Global reach',
    desc: 'Sell to buyers worldwide. NGN or USD. One platform.',
  },
  {
    icon: '📊',
    title: 'Analytics & insights',
    desc: 'Track revenue, customers, and growth. Data-driven decisions.',
  },
  {
    icon: '🔗',
    title: 'Referral program',
    desc: 'Earn commission for every seller you invite. Viral growth.',
  },
  {
    icon: '✓',
    title: 'Verified sellers',
    desc: 'Trust badges for serious sellers. Premium marketplace feel.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-animated opacity-20 dark:opacity-30" />
        <div className="absolute inset-0 bg-background/50" />
        <Navbar transparent />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="glass rounded-2xl p-8 md:p-12 lg:p-16 max-w-4xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              The subscription marketplace for{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">global sellers</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl animate-fade-in-delay-1">
              List products. Get subscribers. Grow your business. 7-day free trial. No card required.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-delay-2">
              <Link href="/signup" className="btn-saas inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30">
                Start free trial
              </Link>
              <Link href="/pricing" className="inline-flex items-center rounded-xl border border-border bg-card/50 px-6 py-3.5 text-base font-semibold text-foreground hover:bg-muted/50 transition-colors">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4 animate-fade-in">Built for growth</h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 animate-fade-in-delay-1">
          Everything you need to run a professional subscription marketplace.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`card-feature rounded-2xl border border-border bg-card p-6 glass ${i === 0 ? 'animate-fade-in-delay-1' : i === 1 ? 'animate-fade-in-delay-2' : i === 2 ? 'animate-fade-in-delay-3' : 'animate-fade-in-delay-3'}`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Featured Products</h2>
        <ProductList />
      </section>
      <BottomNav />
    </main>
  )
}
