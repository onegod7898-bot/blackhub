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
    <main className="min-h-screen bg-background py-12 px-4 pb-24">
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">BlackHub Pricing</h1>
          <p className="text-muted-foreground">7-day free trial. No card required to start.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setCurrency('NGN')} className={`px-4 py-2 rounded-lg ${currency === 'NGN' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>NGN</button>
            <button onClick={() => setCurrency('USD')} className={`px-4 py-2 rounded-lg ${currency === 'USD' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>USD</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">Starter</h2>
            <p className="text-muted-foreground mb-6">For individuals</p>
            <div className="mb-6"><span className="text-4xl font-bold text-foreground">{starterPrice}</span><span className="text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8 text-muted-foreground">
              <li>7-day free trial</li>
              <li>Max 5 listings</li>
              <li>Basic analytics</li>
              <li>Standard support</li>
            </ul>
            {session ? (
              <button onClick={() => handleSubscribe('starter')} disabled={!!loading} className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading === 'starter' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="block w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 text-center">Start free trial</Link>
            )}
          </div>
          <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">Pro</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pro</h2>
            <p className="text-muted-foreground mb-6">For growing businesses</p>
            <div className="mb-6"><span className="text-4xl font-bold text-foreground">{proPrice}</span><span className="text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8 text-muted-foreground">
              <li>7-day free trial</li>
              <li>Unlimited listings</li>
              <li>Advanced analytics</li>
              <li>Priority badge</li>
              <li>Featured placement</li>
            </ul>
            {session ? (
              <button onClick={() => handleSubscribe('pro')} disabled={!!loading} className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading === 'pro' ? 'Redirecting...' : 'Subscribe with Paystack'}
              </button>
            ) : (
              <Link href="/signup" className="block w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 text-center">Start free trial</Link>
            )}
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-8 text-sm">Nigeria: NGN. International: USD.</p>
      </div>
      <BottomNav />
    </main>
  )
}
