#!/usr/bin/env node
/** Run: npx web-push generate-vapid-keys
 *  Add output to Vercel: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, NEXT_PUBLIC_VAPID_PUBLIC_KEY
 */
console.log('\nTo generate VAPID keys for web push, run:\n  npx web-push generate-vapid-keys\n')
console.log('Then add to Vercel → Settings → Environment Variables:')
console.log('  - VAPID_PUBLIC_KEY')
console.log('  - VAPID_PRIVATE_KEY')
console.log('  - NEXT_PUBLIC_VAPID_PUBLIC_KEY (same as public)\n')
