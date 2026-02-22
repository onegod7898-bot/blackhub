'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single()

      if (!profile?.role) {
        try {
          await fetch('/api/auth/onboarding', {
            method: 'POST',
            headers: { Authorization: `Bearer ${data.session.access_token}` },
          })
        } catch {
          // ignore
        }
      }
    })
  }, [router])

  return <>{children}</>
}
