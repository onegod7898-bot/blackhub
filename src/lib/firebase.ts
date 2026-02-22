// Firebase initialization for web (client-side only)
'use client'

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | null = null
let analytics: Analytics | null = null

export function initFirebase(): { app: FirebaseApp; analytics: Analytics } | null {
  if (typeof window === 'undefined') return null
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
    analytics = getAnalytics(app)
  } else {
    app = getApps()[0] as FirebaseApp
    analytics = getAnalytics(app)
  }

  return app && analytics ? { app, analytics } : null
}

export function getAnalyticsInstance(): Analytics | null {
  if (typeof window === 'undefined') return null
  if (analytics) return analytics
  const init = initFirebase()
  return init?.analytics ?? null
}
