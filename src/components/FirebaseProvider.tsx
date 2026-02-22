'use client'

import { useEffect } from 'react'
import { initFirebase } from '@/lib/firebase'

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initFirebase()
  }, [])
  return <>{children}</>
}
