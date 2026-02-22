# BlackHub

Next.js SaaS app with Supabase (auth + database), Paystack payments, subscriptions (Starter / Pro), 7-day trial, seller profiles, product listings, and a CEO-only admin panel.

## Tech stack

- **Frontend:** Next.js (App Router)
- **Backend / Auth / DB:** Supabase
- **Payments:** Paystack (NGN + USD)

## Getting started

### 1. Install and run

```bash
cd blackhub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it | Required for |
|----------|-----------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | App + auth + DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | App + auth + DB |
| `PAYSTACK_SECRET_KEY` | [Paystack Dashboard](https://dashboard.paystack.com) → API Keys | Checkout + subscriptions |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Same | Client-side Paystack (if used) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | Verify-payment (activate subscription), Admin stats |
| `NEXT_PUBLIC_CEO_EMAIL` | Your CEO login email | Access to `/admin` |

- **Required for core app:** Supabase URL + anon key, Paystack secret key.
- **Required for subscription activation after payment:** `SUPABASE_SERVICE_ROLE_KEY`.
- **Required for admin panel:** `NEXT_PUBLIC_CEO_EMAIL` (must match the logged-in user’s email).

### 3. Database (Supabase)

1. In Supabase, run the base schema first: **`supabase-schema.sql`** (in this repo).
2. Then run **`supabase-migrations.sql`** in the SQL Editor.

This creates:

- `profiles` (seller profile)
- `subscriptions` (plan, trial, status)
- `products` with `seller_id` and RLS
- Trigger: new auth user → create profile + 7-day trial subscription (Starter)

### 4. CEO admin access

1. Set `NEXT_PUBLIC_CEO_EMAIL=ceo@yourcompany.com` (or the email you use to log in).
2. Sign up or log in with that email.
3. Open **[/admin](http://localhost:3000/admin)** to see total users, active subscriptions, trial users, revenue, and growth (new users last 7 days).

## Main routes

| Route | Who | Description |
|-------|-----|-------------|
| `/` | Everyone | Landing + product list + payment example |
| `/pricing` | Everyone | Starter ($9 / ₦3,000) & Pro ($19 / ₦7,500), 7-day trial |
| `/login`, `/signup` | Guests | Auth (Supabase email/password) |
| `/dashboard` | Logged-in + **active or trialing** subscription | My Listings CRUD, profile link, logout |
| `/profile` | Logged-in | Edit seller profile (display name, company) |
| `/admin` | CEO only (`NEXT_PUBLIC_CEO_EMAIL`) | Total users, subscriptions, revenue, trials, growth |

## Subscription flow

- **Sign up** → Profile + subscription row created with **7-day trial** (Starter).
- **Dashboard** is gated by `SubscribedRoute`: only `trialing` or `active` can access; others are redirected to `/pricing`.
- **Pricing** → Subscribe with Paystack (Starter or Pro, NGN or USD) → success → verify-payment API activates subscription (needs `SUPABASE_SERVICE_ROLE_KEY`).

## Optional: Stripe later

The codebase is set up for Paystack only. To add Stripe for international later:

- Uncomment or restore `lib/stripe.ts` and add `STRIPE_SECRET_KEY` (and optionally a publishable key).
- Add a branch in checkout (e.g. by country or currency) to use Stripe when not using Paystack.

## Deploy

- Set all env vars in your host (Vercel, etc.).
- Run the same SQL in your Supabase project.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_CEO_EMAIL` are set so subscriptions and admin work in production.
