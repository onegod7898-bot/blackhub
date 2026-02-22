'use client'

import { useState, useEffect } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

const STORAGE_KEY = 'blackhub-push-prompt-dismissed'

export default function NotificationPrompt() {
  const { status, isSupported, requestPermission } = usePushNotifications()
  const [dismissed, setDismissed] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1')
    setMounted(true)
  }, [])

  if (!mounted || !isSupported || status !== 'default' || dismissed) return null

  const handleEnable = () => {
    requestPermission()
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto bg-card border border-border rounded-xl shadow-lg p-4 flex items-start gap-3">
      <span className="text-2xl shrink-0">🔔</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">Enable notifications</p>
        <p className="text-sm text-muted-foreground">Get alerts for new messages and trial reminders.</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleEnable}
            className="text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Enable
          </button>
          <button
            onClick={handleDismiss}
            className="text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
