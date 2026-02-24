'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

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
        body: JSON.stringify({ plan, currency, billing }),
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
      <header className="sticky top-0 z-50 nav-premium">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {!session && <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl px-4 py-2 transition-colors">Log in</Link>}
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-[1280px] mx-auto mt-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-hero font-bold text-heading tracking-tight">Simple pricing</h1>
          <p className="text-muted-foreground mt-4 text-base">Start selling free for 7 days. No card needed.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex rounded-2xl border border-border bg-card/50 p-1.5">
              <button
                onClick={() => setCurrency('NGN')}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${currency === 'NGN' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                NGN
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${currency === 'USD' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                USD
              </button>
            </div>
            <div className="inline-flex rounded-2xl border border-border bg-card/50 p-1.5">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Yearly <span className="text-xs ml-1 opacity-90">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <div className="group card-elevated rounded-3xl border border-border bg-card p-8 lg:p-10 transition-all hover:scale-[1.02]">
            <h2 className="text-section font-bold text-heading mb-1">Starter</h2>
            <p className="text-muted-foreground text-base mb-8">For individuals</p>
            <div className="mb-10">
              <span className="text-4xl lg:text-5xl font-bold text-heading tracking-tight">{starterDisplay}</span>
              <span className="text-muted-foreground text-base">/month</span>
            </div>
            <ul className="space-y-5 mb-10 text-base text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                7-day free trial
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Max 5 listings
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Basic analytics
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Standard support
              </li>
            </ul>
            {session ? (
              <button
                onClick={() => handleSubscribe('starter')}
                disabled={!!loading}
                className="btn-primary w-full rounded-2xl bg-primary py-4 text-primary-foreground font-bold text-base disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading === 'starter' ? <span className="inline-flex items-center gap-2"><span className="spinner" />Redirecting...</span> : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="btn-primary block w-full rounded-2xl bg-primary py-4 text-primary-foreground font-bold text-base text-center shadow-lg shadow-primary/20">
                Start free trial
              </Link>
            )}
          </div>
          <div className="relative card-elevated rounded-3xl border-2 border-primary bg-card p-8 lg:p-10 shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-lg">
              Featured
            </div>
            <h2 className="text-section font-bold text-heading mb-1">Pro</h2>
            <p className="text-muted-foreground text-base mb-8">For growing businesses</p>
            <div className="mb-10">
              <span className="text-4xl lg:text-5xl font-bold text-heading tracking-tight">{proDisplay}</span>
              <span className="text-muted-foreground text-base">/month</span>
            </div>
            <ul className="space-y-5 mb-10 text-base text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                7-day free trial
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Unlimited listings
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Advanced analytics
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Priority badge
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                Featured placement
              </li>
            </ul>
            {session ? (
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={!!loading}
                className="btn-primary w-full rounded-2xl bg-primary py-4 text-primary-foreground font-bold text-base disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading === 'pro' ? <span className="inline-flex items-center gap-2"><span className="spinner" />Redirecting...</span> : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="btn-primary block w-full rounded-2xl bg-primary py-4 text-primary-foreground font-bold text-base text-center shadow-lg shadow-primary/20">
                Start free trial
              </Link>
            )}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-12">Nigeria: NGN. International: USD.</p>
      </div>
      <BottomNav />
    </main>
  )
}
