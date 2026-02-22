'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type PushStatus = 'unsupported' | 'default' | 'denied' | 'granted' | 'error'

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    setIsSupported(true)
    if (Notification.permission === 'granted') setStatus('granted')
    else if (Notification.permission === 'denied') setStatus('denied')
    else setStatus('default')
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return
    try {
      const perm = await Notification.requestPermission()
      setStatus(perm === 'granted' ? 'granted' : perm === 'denied' ? 'denied' : 'default')
      if (perm === 'granted') await registerPushSubscription()
    } catch { setStatus('error') }
  }, [isSupported])

  const registerPushSubscription = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/push/vapid-public-key')
    if (!res.ok) return
    const { publicKey } = await res.json()
    if (!publicKey) return
    let reg = await navigator.serviceWorker.getRegistration()
    if (!reg) reg = await navigator.serviceWorker.register('/sw.js')
    if (!reg) return
    reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) })
    await fetch('/api/push/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ push_subscription: sub.toJSON(), platform: 'web' }),
    })
  }, [])

  return { status, isSupported, requestPermission, registerPushSubscription }
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}
