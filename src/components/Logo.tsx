'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="BlackHub - Connect. Sell. Grow."
        width={140}
        height={40}
        priority
        className="h-10 w-auto"
      />
    </Link>
  )
}
