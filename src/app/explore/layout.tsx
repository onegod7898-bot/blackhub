import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Products',
  description: 'Browse and discover products on BlackHub. Search by category: electronics, fashion, home, sports.',
  openGraph: {
    title: 'Explore Products | BlackHub',
    description: 'Browse products on BlackHub marketplace.',
  },
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children
}
