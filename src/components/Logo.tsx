'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  variant?: 'default' | 'compact' | 'full'
}

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
  if (variant === 'full') {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <Image src="/logo.png" alt="BlackHub" width={120} height={36} priority className="h-8 w-auto object-contain" />
      </Link>
    )
  }
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0 overflow-hidden ring-1 ring-primary/20">
        <Image src="/logo.png" alt="" width={36} height={36} priority className="w-full h-full object-contain p-1.5" />
      </span>
      {variant !== 'compact' && (
        <span className="font-semibold text-foreground text-lg tracking-tight group-hover:opacity-90 transition-opacity">
          BlackHub
        </span>
      )}
    </Link>
  )
}
