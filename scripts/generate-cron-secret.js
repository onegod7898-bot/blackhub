#!/usr/bin/env node
/** Run: node scripts/generate-cron-secret.js - then add the output to Vercel env vars as CRON_SECRET */
const crypto = require('crypto')
const secret = crypto.randomBytes(32).toString('hex')
console.log('\n=== CRON_SECRET (add to Vercel → Settings → Environment Variables) ===\n')
console.log(secret)
console.log('\n1. Copy the value above')
console.log('2. Vercel → Your Project → Settings → Environment Variables')
console.log('3. Add: Name = CRON_SECRET, Value = (paste), Environment = Production')
console.log('4. Redeploy\n')
