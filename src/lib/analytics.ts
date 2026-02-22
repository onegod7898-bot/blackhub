// Analytics event tracking - Firebase Analytics for web
'use client'

import { logEvent } from 'firebase/analytics'
import { getAnalyticsInstance } from './firebase'

type AnalyticsEvent =
  | 'user_signup'
  | 'seller_signup'
  | 'trial_started'
  | 'subscription_purchased'
  | 'subscription_failed'
  | 'product_created'
  | 'product_viewed'
  | 'product_shared'
  | 'trial_expiring_soon'
  | 'user_login'

type EventParams = Record<string, string | number | boolean | undefined>

function track(name: AnalyticsEvent, params?: EventParams): void {
  if (typeof window === 'undefined') return
  const analytics = getAnalyticsInstance()
  if (!analytics) return
  try {
    logEvent(analytics, name, params as Record<string, string | number | boolean>)
  } catch {
    // Analytics is non-critical; fail silently
  }
}

export const analytics = {
  userSignup: (params?: { role?: string; country?: string }) =>
    track('user_signup', params),

  sellerSignup: (params?: { country?: string }) =>
    track('seller_signup', params),

  trialStarted: (params?: { userId?: string }) =>
    track('trial_started', params),

  subscriptionPurchased: (params?: { plan?: string; amount?: number }) =>
    track('subscription_purchased', params),

  subscriptionFailed: (params?: { reason?: string }) =>
    track('subscription_failed', params),

  productCreated: (params?: { productId?: string; category?: string }) =>
    track('product_created', params),

  productViewed: (params?: { productId?: string; productName?: string }) =>
    track('product_viewed', params),

  productShared: (params?: { productId?: string; method?: string }) =>
    track('product_shared', params),

  trialExpiringSoon: (params?: { daysLeft?: number }) =>
    track('trial_expiring_soon', params),

  userLogin: (params?: { method?: string }) =>
    track('user_login', params),
}
