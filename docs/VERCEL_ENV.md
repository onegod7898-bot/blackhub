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
- `NEXT_PUBLIC_APP_URL` – e.g. `https://blackhub.vercel.app` or your production URL
- `NEXT_PUBLIC_FIREBASE_*` – Firebase config (analytics)
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` – Web push
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` – Email
- `CRON_SECRET` – Random string (32+ chars) to secure cron endpoints; Vercel sends it as `Authorization: Bearer <CRON_SECRET>` when invoking crons

After adding or changing variables, **redeploy** (Deployments → ⋯ → Redeploy).

---

## Cron jobs (subscription expiration & trial reminders)

Your `vercel.json` defines two crons:
- **expire-subscriptions** – daily at midnight UTC
- **trial-reminders** – daily at noon UTC

**To enable them:**

1. Generate a secret: run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal, or use any 32+ character random string.
2. In **Vercel → Settings → Environment Variables**, add:
   - **Name:** `CRON_SECRET`
   - **Value:** (paste the generated secret)
   - **Environments:** Production
3. Redeploy. Vercel will automatically call your cron endpoints with the secret in the `Authorization` header.

---

## Deployment checklist (if site shows 404)

1. **Root Directory**: If your repo has the Next.js app in a `blackhub` subfolder, set **Vercel → Settings → General → Root Directory** to `blackhub`.
2. **Environment Variables**: Add the 3 required Supabase vars for **Production** (and Preview if you use preview deploys).
3. **Domain**: `blackhub.vercel.app` only works if added in **Settings → Domains**. Otherwise use the default URL (e.g. `blackhub-xxx.vercel.app`) from the Deployments page.
4. **Build**: Check **Deployments** → latest deployment → ensure status is **Ready** (not Failed). If failed, open build logs and fix errors.
5. **Health check**: After deploy, visit `https://your-url.vercel.app/api/health` – should return `{"ok":true}`.
