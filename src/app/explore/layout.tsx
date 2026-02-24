import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Explore Products',
  description: 'Browse and discover products on BlackHub. Search by category: electronics, fashion, home, sports.',
  openGraph: {
    title: 'Explore Products | BlackHub',
    description: 'Browse products on BlackHub marketplace.',
  },
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="spinner" /></div>}>{children}</Suspense>
}
