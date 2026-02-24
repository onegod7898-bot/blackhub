# CEO Admin & Paystack Plans Setup

## 1. CEO Email (Admin Access)

Only the user with this email can access `/admin` and `/bh-portal`.

### Setup

1. In **Vercel → Settings → Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_CEO_EMAIL`
   - **Value:** Your CEO/admin email (e.g. `admin@blackhub.vercel.app` or your actual email)
   - **Environments:** Production (and Preview if needed)

2. Redeploy.

3. Sign up or log in with that email on your site. That user will see "Admin Portal" in their profile and can access `/admin`.

---

## 2. Paystack Recurring Plans (Optional)

For **subscription** checkout (Starter/Pro plans), create plans in Paystack and add the plan codes as env vars. Without these, the app falls back to one-time payment at the same amounts.

### Create Plans in Paystack

1. Go to [Paystack Dashboard](https://dashboard.paystack.com) → **Plans**
2. Create 4 plans:

| Plan Name | Amount | Interval | Currency |
|-----------|--------|----------|----------|
| BlackHub Starter NGN | ₦5,000 | Monthly | NGN |
| BlackHub Pro NGN | ₦10,000 | Monthly | NGN |
| BlackHub Starter USD | $9 | Monthly | USD |
| BlackHub Pro USD | $19 | Monthly | USD |

3. After creating each plan, copy its **Plan Code** (e.g. `PLN_xxxxxxxxxxxx`).

### Add to Vercel

In **Vercel → Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `PAYSTACK_PLAN_STARTER_NGN` | Plan code for ₦5,000/month |
| `PAYSTACK_PLAN_STARTER_USD` | Plan code for $9/month |
| `PAYSTACK_PLAN_PRO_NGN` | Plan code for ₦10,000/month |
| `PAYSTACK_PLAN_PRO_USD` | Plan code for $19/month |

4. Redeploy.

### Without Plans

If you skip this, the checkout still works: it uses one-time payment at the same amounts. Recurring billing (auto-renewal) requires the plans above.
