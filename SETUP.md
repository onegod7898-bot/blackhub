# BlackHub Setup Guide

## Environment Variables

Create a `.env.local` file in the project root with:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role (for admin operations, subscription activation)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack (required for payments)
PAYSTACK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx

# Admin: CEO email (only this user can access /admin)
NEXT_PUBLIC_CEO_EMAIL=ceo@yourcompany.com

# Optional: for cron to expire subscriptions (POST /api/cron/expire-subscriptions)
# CRON_SECRET=your_secret
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema migration in the Supabase SQL Editor:
   - Open `supabase/migrations/001_schema.sql`
   - Copy its contents and paste into Supabase Dashboard → SQL Editor → New Query
   - Run the query

3. Create storage buckets (if not created by migration):
   - Go to Storage → New bucket → `avatars` (public)
   - New bucket → `products` (public)

## Running on Windows

1. **Prerequisites**
   - Node.js 18+ ([nodejs.org](https://nodejs.org))
   - npm (comes with Node.js)

2. **Install dependencies**
   ```powershell
   cd blackhub
   npm install
   ```

3. **Start development server**
   ```powershell
   npm run dev
   ```

4. **Open in browser**
   - Go to http://localhost:3000

5. **Production build**
   ```powershell
   npm run build
   npm start
   ```

## Admin (Hidden)

- Admin is at `/admin` (CEO only)
- Alternative path: `/bh-portal` redirects to `/admin`
- CEO users see "Admin Portal" link in Profile page
- Set `NEXT_PUBLIC_CEO_EMAIL` to the CEO's email

## Messages

- Buyers can contact sellers from product pages.
- Messages appear in the Messages tab.
- Run `supabase/migrations/002_messages.sql` in Supabase SQL Editor.

## Subscription Expiration

- When `current_period_ends_at` passes, users lose access
- Optional: Call `POST /api/cron/expire-subscriptions` with `Authorization: Bearer <CRON_SECRET>` to mark expired subscriptions as `past_due` in the database

## Product Links & Deep Linking

- Share format: `https://blackhubapp.com/p/{product_id}`
- Each product has a unique UUID (Supabase default)
- Share button: Copy link, WhatsApp, system share
- Web fallback page: product preview + "Open in App" / "Download App"
- Set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_PLAY_STORE_URL` for production

## Theme

- **Dark mode** is the default
- **Light/Dark toggle** is available on all pages (top-right) for both buyers and sellers
- Preference is saved in `localStorage` and persists across sessions
