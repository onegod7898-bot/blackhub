'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'
import Navbar from '@/components/Navbar'

export default function PricingPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN')
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session) {
        const { data: p } = await supabase.from('profiles').select('country').eq('id', data.session.user.id).single()
        if (p?.country === 'NG') setCurrency('NGN')
        else setCurrency('USD')
      }
    })
  }, [])

  async function handleSubscribe(plan: 'starter' | 'pro') {
    if (!session) {
      window.location.href = '/login?redirect=/pricing'
      return
    }
    setLoading(plan)
    try {
      const { data: { session: s } } = await supabase.auth.getSession()
      const token = s?.access_token
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan, currency }),
      })
      const data = await res.json()
      if (data.authorizationUrl) window.location.href = data.authorizationUrl
      else alert(data.error || 'Failed to start checkout')
    } catch (e: any) {
      alert(e.message || 'Error')
    } finally {
      setLoading(null)
    }
  }

  const yearlyDiscount = 0.2
  const starterMonthly = currency === 'NGN' ? 5000 : 9
  const proMonthly = currency === 'NGN' ? 10000 : 19
  const starterPerMonth = billing === 'yearly' ? starterMonthly * (1 - yearlyDiscount) : starterMonthly
  const proPerMonth = billing === 'yearly' ? proMonthly * (1 - yearlyDiscount) : proMonthly
  const starterDisplay = currency === 'NGN' ? `₦${starterPerMonth.toLocaleString()}` : `$${starterPerMonth}`
  const proDisplay = currency === 'NGN' ? `₦${proPerMonth.toLocaleString()}` : `$${proPerMonth}`

  return (
    <main className="min-h-screen bg-background py-12 px-4 pb-24 animate-fade-in">
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!session && <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link>}
          </div>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Pricing</h1>
          <p className="text-muted-foreground mt-2">7-day free trial. No card required to start.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setCurrency('NGN')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${currency === 'NGN' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                NGN
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${currency === 'USD' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                USD
              </button>
            </div>
            <div className="flex rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${billing === 'monthly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${billing === 'yearly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Yearly <span className="text-xs ml-1 opacity-90">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-feature rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-1">Starter</h2>
            <p className="text-muted-foreground text-sm mb-6">For individuals</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{starterDisplay}</span>
              <span className="text-muted-foreground text-sm">/{billing === 'yearly' ? 'month' : 'month'}</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li>7-day free trial</li>
              <li>Max 5 listings</li>
              <li>Basic analytics</li>
              <li>Standard support</li>
            </ul>
            {session ? (
              <button
                onClick={() => handleSubscribe('starter')}
                disabled={!!loading}
                className="btn-saas w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold shadow-sm hover:shadow-primary/25 disabled:opacity-50"
              >
                {loading === 'starter' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="btn-saas block w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold text-center shadow-sm hover:shadow-primary/25">
                Start free trial
              </Link>
            )}
          </div>
          <div className="card-feature rounded-2xl border-2 border-primary bg-card p-8 shadow-lg relative ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Most Popular
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Pro</h2>
            <p className="text-muted-foreground text-sm mb-6">For growing businesses</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{proDisplay}</span>
              <span className="text-muted-foreground text-sm">/{billing === 'yearly' ? 'month' : 'month'}</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li>7-day free trial</li>
              <li>Unlimited listings</li>
              <li>Advanced analytics</li>
              <li>Priority badge</li>
              <li>Featured placement</li>
            </ul>
            {session ? (
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={!!loading}
                className="btn-saas w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold shadow-sm hover:shadow-primary/30 disabled:opacity-50"
              >
                {loading === 'pro' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="btn-saas block w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold text-center shadow-sm hover:shadow-primary/30">
                Start free trial
              </Link>
            )}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">Nigeria: NGN. International: USD.</p>
      </div>
      <BottomNav />
    </main>
  )
}
