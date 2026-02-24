# BlackHub Deployment Guide

## Deploy to Vercel

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/blackhub.git
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com) → New Project
   - Import your GitHub repo
   - Framework: Next.js (auto-detected)
   - **Root Directory**: If the Next.js app is in a `blackhub` subfolder, set Root Directory to `blackhub` in project settings

3. **Add Environment Variables** in Vercel Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `NEXT_PUBLIC_CEO_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_PLAY_STORE_URL` (when app is published)
   - `CRON_SECRET` (optional, for cron routes)
   - **Analytics/Email/Push** (see `docs/ANALYTICS_EMAIL_PUSH.md`): Firebase, Resend, VAPID keys

4. **Deploy** – Vercel will build and deploy automatically.

---

## Health Check

- Add route: `/api/health` returns `{ ok: true }` for monitoring.
- Configure in Vercel or your monitoring tool.

---

## Supabase

1. Run migrations in Supabase SQL Editor (in order):
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_messages.sql`
   - `supabase/migrations/003_analytics_email_push.sql`

2. Create storage buckets `avatars` and `products` if not created by migration.

3. In Supabase → Authentication → URL Configuration:
   - Site URL: your production URL
   - Redirect URLs: add your production URL + `/success`, `/login`, etc.

---

## Paystack

1. In Paystack Dashboard → Settings → API Keys, use live keys for production.
2. Webhook URL: `https://your-domain.com/api/webhooks/paystack` – add in Paystack Dashboard → Settings → Webhooks.
3. **Recurring subscriptions (optional):** Create plans in Paystack Dashboard (Plans):
   - Starter NGN: ₦5,000/month
   - Pro NGN: ₦10,000/month
   - Starter USD: $9/month
   - Pro USD: $19/month
   - Copy each plan code and set env vars: `PAYSTACK_PLAN_STARTER_NGN`, `PAYSTACK_PLAN_PRO_NGN`, etc.
