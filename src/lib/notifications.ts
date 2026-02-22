// Push notification service - Web Push for web; extensible for Expo when mobile app exists
import webpush from 'web-push'
import { supabaseAdmin } from './supabase-admin'

let vapidKeys: { publicKey: string; privateKey: string } | null = null

function getVapidKeys() {
  if (!vapidKeys) {
    const pub = process.env.VAPID_PUBLIC_KEY
    const priv = process.env.VAPID_PRIVATE_KEY
    if (pub && priv) {
      vapidKeys = { publicKey: pub, privateKey: priv }
      webpush.setVapidDetails('mailto:support@blackhubapp.com', pub, priv)
    }
  }
  return vapidKeys
}

type Platform = 'web' | 'expo_android' | 'expo_ios'

interface PushPayload {
  title: string
  body: string
  url?: string
  data?: Record<string, string>
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  if (!supabaseAdmin) return { sent: 0, failed: 0 }
  const keys = getVapidKeys()
  if (!keys) return { sent: 0, failed: 0 }

  const { data: tokens } = await supabaseAdmin
    .from('push_tokens')
    .select('token, platform')
    .eq('user_id', userId)

  if (!tokens?.length) return { sent: 0, failed: 0 }

  let sent = 0
  let failed = 0

  for (const row of tokens) {
    try {
      if (row.platform === 'web') {
        const subscription = JSON.parse(row.token)
        await webpush.sendNotification(
          subscription,
          JSON.stringify({ title: payload.title, body: payload.body, url: payload.url, ...payload.data }),
          { TTL: 86400 }
        )
        sent++
      } else {
        // Expo: use Expo Push API - implement when mobile app exists
        // await sendExpoPush(row.token, payload)
        failed++
      }
    } catch {
      failed++
    }
  }

  return { sent, failed }
}

export async function sendPushTrialExpiring(userId: string, daysLeft: number) {
  return sendPushToUser(userId, {
    title: 'Trial ending soon',
    body: `Your BlackHub trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Subscribe to keep listing.`,
    url: '/pricing',
    data: { type: 'trial_expiring' },
  })
}

export async function sendPushSubscriptionSuccess(userId: string, plan: string) {
  return sendPushToUser(userId, {
    title: 'Subscription active',
    body: `Your ${plan} plan is now active.`,
    url: '/dashboard',
    data: { type: 'subscription_success' },
  })
}

export async function sendPushNewMessage(userId: string, preview: string) {
  return sendPushToUser(userId, {
    title: 'New message',
    body: preview,
    url: '/messages',
    data: { type: 'new_message' },
  })
}
