# BlackHub Complete Setup Guide

## 1. Contact Form (Resend)

The contact form sends emails via Resend. Add to Vercel:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_FROM_EMAIL` | `BlackHub <noreply@yourdomain.com>` |
| `SUPPORT_EMAIL` | Email to receive contact form submissions |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Same – shown on contact page |

## 2. Web Push (VAPID)

For push notifications (trial reminders, subscription success):

```bash
npx web-push generate-vapid-keys
```

Add to Vercel:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

## 3. Firebase Analytics

Optional. Add all `NEXT_PUBLIC_FIREBASE_*` vars from Firebase Console.

## 4. Yearly Billing (Paystack)

Create yearly plans in Paystack Dashboard, then add:

- `PAYSTACK_PLAN_STARTER_NGN_YEARLY`
- `PAYSTACK_PLAN_STARTER_USD_YEARLY`
- `PAYSTACK_PLAN_PRO_NGN_YEARLY`
- `PAYSTACK_PLAN_PRO_USD_YEARLY`

Without these, yearly checkout uses one-time payment at the discounted amount.

## 5. Admin: Verify Sellers

CEO can verify sellers in **Admin → Users** → click **Verify** next to a seller. Verified sellers show a badge on products and profiles.

## 6. Orders Table

Migration `005_orders.sql` creates the orders table for future product sales. Run in Supabase SQL Editor when you add a product checkout flow.
