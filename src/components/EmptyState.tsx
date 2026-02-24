'use client'

import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
  illustration?: 'search' | 'products' | 'listings' | 'messages' | 'generic'
}

const illustrations: Record<string, React.ReactNode> = {
  search: (
    <svg className="w-24 h-24 mx-auto text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  products: (
    <svg className="w-24 h-24 mx-auto text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  listings: (
    <svg className="w-24 h-24 mx-auto text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  messages: (
    <svg className="w-24 h-24 mx-auto text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  generic: (
    <svg className="w-24 h-24 mx-auto text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  illustration = 'generic',
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <div className="mb-6">{illustrations[illustration] || illustrations.generic}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">{description}</p>}
      {(ctaLabel && (ctaHref || onCtaClick)) && (
        onCtaClick ? (
          <button onClick={onCtaClick} className="btn-primary inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            {ctaLabel}
          </button>
        ) : (
          <Link href={ctaHref!} className="btn-primary inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            {ctaLabel}
          </Link>
        )
      )}
    </div>
  )
}
