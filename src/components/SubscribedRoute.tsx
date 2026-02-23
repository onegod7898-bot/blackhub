'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isActiveAccess } from '@/lib/subscription'
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

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('status, trial_ends_at, current_period_ends_at')
          .eq('user_id', data.session.user.id)
          .single()

        if (!mounted) return
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
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 text-center border border-border">
          <div className="mb-6 mx-auto w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Subscription Required</h1>
          <p className="text-muted-foreground mb-6">
            Your 7-day free trial has ended. Subscribe to continue listing products.
          </p>
          <Link
            href="/pricing"
            className="inline-block w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    )
  }
  if (!allowed) return null
  return <>{children}</>
}
