'use client'

export default function LogoSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`spinner-logo flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="currentColor" opacity="0.2" />
        <path
          d="M20 12v16M14 18l6-6 6 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="12" r="2.5" fill="currentColor" />
      </svg>
    </div>
  )
}
