// Paystack client configuration
// This replaces Stripe for now, but structure allows easy switch back to Stripe later

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

if (!paystackSecretKey) {
  throw new Error('Missing PAYSTACK_SECRET_KEY environment variable')
}

// Paystack API base URL
export const PAYSTACK_API_URL = 'https://api.paystack.co'

// Paystack secret key for server-side requests
export const PAYSTACK_SECRET_KEY = paystackSecretKey

// Helper function to make Paystack API requests
export async function paystackRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${PAYSTACK_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Paystack API error')
  }
  if (data.status === false && data.message) {
    throw new Error(data.message)
  }
  return data
}
