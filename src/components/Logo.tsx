'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
  variant?: 'default' | 'compact' | 'full'
}

/* Symbol: Growth + hub. Upward motion, connected nodes, rounded square. Fintech minimal. */
function LogoIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="currentColor" className="text-primary" />
      {/* Upward arrow + hub node */}
      <path
        d="M20 12v16M14 18l6-6 6 6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="12" r="2.5" fill="white" />
    </svg>
  )
}

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
  if (variant === 'full') {
    return (
      <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
        <LogoIcon className="w-10 h-10 shrink-0" />
        <span className="font-bold text-foreground text-xl tracking-tight uppercase group-hover:opacity-90 transition-opacity duration-200">
          BlackHub
        </span>
      </Link>
    )
  }
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoIcon className="shrink-0" />
      {variant !== 'compact' && (
        <span className="font-bold text-foreground text-lg tracking-tight uppercase group-hover:opacity-90 transition-opacity duration-200">
          BlackHub
        </span>
      )}
    </Link>
  )
}
