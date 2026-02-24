import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'BlackHub pricing plans. Starter and Pro. 7-day free trial. NGN and USD. No card required to start.',
  openGraph: {
    title: 'Pricing | BlackHub',
    description: 'Starter and Pro plans. 7-day free trial. NGN and USD.',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
