'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export default function SubscribedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [needsUpgrade, setNeedsUpgrade] = useState(false)
  const trialExpiringTracked = useRef(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        if (!data.session) {
          router.push('/login')
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, suspended')
          .eq('id', data.session.user.id)
          .single()

        if (!mounted) return
        if (profile?.suspended) {
          setAllowed(false)
          setNeedsUpgrade(false)
          return
        }
        if (profile?.role === 'buyer') {
          router.push('/explore')
          return
        }

        let profileData = profile
        let { data: sub } = await supabase
          .from('subscriptions')
          .select('status, trial_ends_at, current_period_ends_at')
          .eq('user_id', data.session.user.id)
          .single()

        if (!mounted) return
        const needsOnboarding = !profileData || (profileData.role === 'seller' && !sub)
        if (needsOnboarding) {
          try {
            await fetch('/api/auth/onboarding', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
              body: JSON.stringify({}),
            })
            if (!mounted) return
            const { data: profData } = await supabase.from('profiles').select('role, suspended').eq('id', data.session.user.id).single()
            const { data: subData } = await supabase.from('subscriptions').select('status, trial_ends_at, current_period_ends_at').eq('user_id', data.session.user.id).single()
            if (mounted) {
              profileData = profData
              sub = subData
            }
          } catch {
            // ignore
          }
        }
        if (!mounted) return
        if (profileData?.role === 'buyer') {
          router.push('/explore')
          return
        }
        const status = sub?.status ?? null
        const trialEndsAt = sub?.trial_ends_at ?? null
        const currentPeriodEndsAt = sub?.current_period_ends_at ?? null

        const valid =
          (status === 'trialing' && trialEndsAt && new Date() <= new Date(trialEndsAt)) ||
          (status === 'active' && (!currentPeriodEndsAt || new Date() <= new Date(currentPeriodEndsAt)))

        if (valid) {
          setAllowed(true)
          setNeedsUpgrade(false)
          if (status === 'trialing' && trialEndsAt && !trialExpiringTracked.current) {
            const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000)
            if (daysLeft >= 1 && daysLeft <= 2) {
              trialExpiringTracked.current = true
              analytics.trialExpiringSoon({ daysLeft })
            }
          }
        } else {
          setAllowed(false)
          setNeedsUpgrade(true)
        }
      } catch {
        if (mounted) {
          setAllowed(false)
          setNeedsUpgrade(true)
        }
      }
    })()
    return () => { mounted = false }
  }, [router])

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }
  if (!allowed && !needsUpgrade) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-24">
        <nav className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Logo />
          <ThemeToggle />
        </nav>
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 text-center border border-border">
          <div className="mb-6 mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Account Suspended</h1>
          <p className="text-muted-foreground mb-6">Your account has been suspended. Please contact support.</p>
        </div>
      </div>
    )
  }
  if (!allowed && needsUpgrade) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-24">
        <nav className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Logo />
          <ThemeToggle />
        </nav>
        <div className="w-full max-w-md bg-card/50 backdrop-blur-xl rounded-3xl p-10 text-center border border-border/50 shadow-2xl shadow-primary/5">
          <div className="mb-6 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Trial ended</h1>
          <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
            Your 7-day free trial is over. Upgrade to keep listing products and growing your store.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            View plans
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }
  if (!allowed) return null
  return <>{children}</>
}
