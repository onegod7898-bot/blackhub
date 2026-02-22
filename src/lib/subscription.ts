// Subscription plan prices (cents/kobo). NGN for Nigeria, USD for international.
export const PLANS = {
  starter: {
    name: 'Starter',
    ngn: 5000_00,   // ₦5,000 in kobo
    usd: 9_00,      // $9 in cents
    maxListings: 5,
  },
  pro: {
    name: 'Pro',
    ngn: 10000_00,  // ₦10,000 in kobo
    usd: 19_00,     // $19 in cents
    maxListings: Infinity,
  },
} as const

export type PlanKey = keyof typeof PLANS
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export function isActiveAccess(status: string | null): boolean {
  return status === 'trialing' || status === 'active'
}

/** Check if subscription is valid: status is active/trialing AND period has not ended */
export function isSubscriptionValid(
  status: string | null,
  trialEndsAt: string | null,
  currentPeriodEndsAt: string | null
): boolean {
  if (!status) return false
  if (status === 'trialing') {
    if (!trialEndsAt) return true
    return new Date() <= new Date(trialEndsAt)
  }
  if (status === 'active') {
    if (!currentPeriodEndsAt) return true
    return new Date() <= new Date(currentPeriodEndsAt)
  }
  return false
}
