# BlackHub Analytics, Email & Push Notifications

## Overview

BlackHub includes:
1. **Firebase Analytics** – event tracking for user actions
2. **Resend Email** – transactional emails (welcome, trial reminders, subscription confirmation)
3. **Web Push** – browser notifications (trial expiring, subscription success, new messages)

---

## 1. Analytics (Firebase)

### Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Add a web app and copy the config
3. Enable Analytics in Firebase Console
4. Add env vars:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### Tracked Events

| Event | When |
|-------|------|
| `user_signup` | User signs up (role, country) |
| `seller_signup` | Seller signs up |
| `trial_started` | Seller gets 7-day trial |
| `subscription_purchased` | *(Add via Measurement Protocol if needed)* |
| `subscription_failed` | *(Add via Measurement Protocol if needed)* |
| `product_created` | Seller creates a product |
| `product_viewed` | User views a product |
| `product_shared` | User shares (copy, WhatsApp, native) |
| `trial_expiring_soon` | Trial ends in 1–2 days |
| `user_login` | User logs in |

### Files

- `src/lib/firebase.ts` – Firebase init
- `src/lib/analytics.ts` – event helpers
- `src/components/FirebaseProvider.tsx` – initializes Firebase on load

---

## 2. Email (Resend)

### Setup

1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Add env vars:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=BlackHub <noreply@yourdomain.com>
```

### Templates

| Template | Trigger |
|----------|---------|
| `welcome` | After signup |
| `trial_reminder_day5` | 5 days after trial start (2 days left) |
| `trial_reminder_day6` | 6 days after trial start (1 day left) |
| `subscription_confirmation` | After successful payment |
| `subscription_renewal_reminder` | Before renewal *(add cron if needed)* |

### Duplicate Prevention

`email_log` table stores `(user_id, template_type)` to avoid sending the same email twice.

### Files

- `src/lib/email-templates.ts` – HTML templates (dark theme)
- `src/lib/email.ts` – Resend client
- `src/lib/send-email-if-needed.ts` – checks `email_log`, then sends
- `src/app/api/email/send/route.ts` – HTTP API (for cron; use `Authorization: Bearer CRON_SECRET`)

---

## 3. Push Notifications (Web Push)

### Setup

1. Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

2. Add env vars:

```env
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
```

`NEXT_PUBLIC_VAPID_PUBLIC_KEY` is used by the client; the private key stays server-side.

### Triggers

| Event | When |
|-------|------|
| Trial expiring | Day 5 and 6 of trial (via cron) |
| Subscription success | Paystack webhook |
| New message | Message API after insert |

### Permission Flow

- `NotificationPrompt` shows on first visit (dismissible, stored in `localStorage`)
- User clicks "Enable" → browser permission → subscription saved in `push_tokens`
- Requires HTTPS in production
- Service worker: `public/sw.js`

### Files

- `src/lib/notifications.ts` – send push to user
- `src/app/api/push/register/route.ts` – register/delete tokens
- `src/app/api/push/vapid-public-key/route.ts` – returns public key
- `src/hooks/usePushNotifications.ts` – permission + subscribe
- `src/components/NotificationPrompt.tsx` – UI
- `public/sw.js` – service worker for receiving push

---

## 4. Database Migration

Run `supabase/migrations/003_analytics_email_push.sql`:

- `email_log` – sent emails (no duplicate sends)
- `push_tokens` – device tokens for push

---

## 5. Cron Jobs

Configure Vercel Cron (or similar):

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/expire-subscriptions", "schedule": "0 0 * * *" },
    { "path": "/api/cron/trial-reminders", "schedule": "0 12 * * *" }
  ]
}
```

Set `CRON_SECRET` and call with:

```
Authorization: Bearer YOUR_CRON_SECRET
```

---

## 6. Full Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=BlackHub <noreply@yourdomain.com>

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=

# Cron (optional)
CRON_SECRET=

# Existing
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_SECRET_KEY=
```

---

## 7. Expo / React Native (Future)

When you add a mobile app:

- Store Expo push tokens in `push_tokens` with `platform: 'expo_android'` or `'expo_ios'`
- Use [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/) in `src/lib/notifications.ts` for non-web platforms
- Keep the same triggers (trial, subscription, new message)
