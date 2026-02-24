# BlackHub – Done vs Not Done

## ✅ DONE (Implemented & Working)

### Core
- Authentication (signup, login, onboarding)
- 7-day free trial for sellers (no card required)
- Subscription flow (Paystack)
- Product listings (create, edit, delete from dashboard)
- Product explore & detail pages
- Seller profiles with verified badges
- Contact seller form
- Messages / chat system

### Payments
- Paystack subscription checkout
- Paystack webhook handler
- Payment verification
- Checkout sessions

### Admin
- Admin panel (CEO-only)
- Verify sellers
- Suspend / unsuspend users
- Admin stats

### Referrals
- Referral codes
- Referral earnings on seller signup
- Referral earnings on subscription payment (10% or min ₦5/$5)

### Other
- Contact form (Resend)
- Push notifications (VAPID)
- Email templates (welcome, subscription, trial reminders)
- Cron: expire subscriptions, trial reminders
- Health check `/api/health`
- SEO (metadata, sitemap, robots, JSON-LD)
- Dark mode, responsive UI

### Migrations
- 001_schema.sql
- 002_messages.sql
- 003_analytics_email_push.sql
- 004_referrals_verified.sql
- 005_orders.sql

---

## ❌ NOT DONE (Future / Optional)

### Product Purchase Flow
- Orders table exists but no product checkout UI
- No "Buy Now" on product page (currently Contact Seller only)
- Would need: product checkout API, order creation on payment success

### Optional Setup
- Paystack plan codes (PAYSTACK_PLAN_*_YEARLY) for recurring billing
- Stripe integration (commented out)
- Expo push (mobile app)
- Firebase Analytics

---

## Deployment Checklist

See [DEPLOY.md](../DEPLOY.md) for full steps. Key items:
1. Run all 5 migrations in Supabase
2. Set env vars in Vercel
3. Add Paystack webhook URL
4. Configure Supabase auth redirect URLs
