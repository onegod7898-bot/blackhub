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

  const starterPrice = currency === 'NGN' ? '₦5,000' : '$9'
  const proPrice = currency === 'NGN' ? '₦10,000' : '$19'

  return (
    <main className="min-h-screen bg-background py-12 px-4 pb-24 animate-fade-in">
      <nav className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <Logo />
          <ThemeToggle />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Pricing</h1>
          <p className="text-muted-foreground mt-2">7-day free trial. No card required to start.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setCurrency('NGN')} className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${currency === 'NGN' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>NGN</button>
            <button onClick={() => setCurrency('USD')} className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${currency === 'USD' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>USD</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-1">Starter</h2>
            <p className="text-muted-foreground text-sm mb-6">For individuals</p>
            <div className="mb-6"><span className="text-3xl font-bold text-foreground">{starterPrice}</span><span className="text-muted-foreground text-sm">/month</span></div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li>7-day free trial</li>
              <li>Max 5 listings</li>
              <li>Basic analytics</li>
              <li>Standard support</li>
            </ul>
            {session ? (
              <button onClick={() => handleSubscribe('starter')} disabled={!!loading} className="w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                {loading === 'starter' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="block w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold text-center shadow-sm hover:opacity-90 transition-opacity">Start free trial</Link>
            )}
          </div>
          <div className="rounded-2xl border-2 border-primary bg-card p-8 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Pro</div>
            <h2 className="text-xl font-bold text-foreground mb-1">Pro</h2>
            <p className="text-muted-foreground text-sm mb-6">For growing businesses</p>
            <div className="mb-6"><span className="text-3xl font-bold text-foreground">{proPrice}</span><span className="text-muted-foreground text-sm">/month</span></div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li>7-day free trial</li>
              <li>Unlimited listings</li>
              <li>Advanced analytics</li>
              <li>Priority badge</li>
              <li>Featured placement</li>
            </ul>
            {session ? (
              <button onClick={() => handleSubscribe('pro')} disabled={!!loading} className="w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                {loading === 'pro' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="block w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold text-center shadow-sm hover:opacity-90 transition-opacity">Start free trial</Link>
            )}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">Nigeria: NGN. International: USD.</p>
      </div>
      <BottomNav />
    </main>
  )
}
