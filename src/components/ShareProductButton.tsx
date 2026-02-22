'use client'

import { useState } from 'react'
import { analytics } from '@/lib/analytics'

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_APP_URL || 'https://blackhubapp.com'
}

interface ShareProductButtonProps {
  productId: string
  productName: string
  productPrice: number
}

function trackShare(method: string, productId: string) {
  try {
    analytics.productShared({ productId, method })
  } catch {
    // non-critical
  }
}

export default function ShareProductButton({ productId, productName, productPrice }: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false)
  const link = `${getBaseUrl()}/p/${productId}`
  const shareText = `Check out ${productName} - $${productPrice} on BlackHub: ${link}`

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(link)
      trackShare('copy', productId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = link
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      trackShare('copy', productId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function shareWhatsApp() {
    trackShare('whatsapp', productId)
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')
  }

  async function shareNative() {
    if (navigator.share) {
      try {
        trackShare('native', productId)
        await navigator.share({
          title: productName,
          text: `${productName} - $${productPrice}`,
          url: link,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={copyToClipboard}
        className="flex-1 min-w-[100px] py-2.5 px-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
      <button
        onClick={shareWhatsApp}
        className="flex-1 min-w-[100px] py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
      >
        WhatsApp
      </button>
      <button
        onClick={shareNative}
        className="flex-1 min-w-[100px] py-2.5 px-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
      >
        Share
      </button>
    </div>
  )
}
