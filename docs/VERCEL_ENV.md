# Vercel environment variables

Add these in **Vercel → Your Project → Settings → Environment Variables**.

## Required for build and runtime

| Name | Value | Environments |
|------|--------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon (publishable) key | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key | Production, Preview |

Get these from **Supabase Dashboard → Project → Settings → API**.

## Optional (for full functionality)

- `PAYSTACK_SECRET_KEY` – Paystack secret key (payments)
- `NEXT_PUBLIC_APP_URL` – e.g. `https://your-app.vercel.app`
- `NEXT_PUBLIC_FIREBASE_*` – Firebase config (analytics)
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` – Web push
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` – Email

After adding or changing variables, **redeploy** (Deployments → ⋯ → Redeploy).
