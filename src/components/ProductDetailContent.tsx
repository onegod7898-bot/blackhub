'use client'

import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import ShareProductButton from '@/components/ShareProductButton'
import ContactSellerForm from '@/components/ContactSellerForm'

const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.blackhub.app'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  seller_id: string
}

interface Profile {
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
}

export default function ProductDetailContent() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [seller, setSeller] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
        if (p) analytics.productViewed({ productId: p.id, productName: p.name })
        setProduct(p)
        if (p?.seller_id) {
          const { data: s } = await supabase
            .from('profiles')
            .select('display_name, company_name, avatar_url')
            .eq('id', p.seller_id)
            .single()
          setSeller(s)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  function openInApp() {
    const deepLink = `blackhub://product/${id}`
    window.location.href = deepLink
    setTimeout(() => {
      window.location.href = PLAY_STORE_URL
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <ThemeToggle />
        <h1 className="text-xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">This product may have been removed or the link is invalid.</p>
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    )
  }

  const sellerName = seller?.display_name || seller?.company_name || 'Seller'

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
          <div className="aspect-square bg-muted flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl text-muted-foreground">📦</span>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-4">${product.price}</p>
            {product.description && (
              <p className="text-muted-foreground mb-6">{product.description}</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3">Share Product</h3>
          <ShareProductButton
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
          />
        </div>

        <Link href={`/seller/${product.seller_id}`} className="block bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center gap-4">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">👤</div>
            )}
            <div>
              <h3 className="font-semibold text-foreground">Seller: {sellerName}</h3>
              <p className="text-muted-foreground text-sm">View seller profile</p>
            </div>
          </div>
        </Link>

        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-2">Get the App</h3>
          <p className="text-muted-foreground text-sm mb-4">Open in the BlackHub app for the best experience</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={openInApp}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Open in App
            </button>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors text-center"
            >
              Download App
            </a>
          </div>
        </div>

        <ContactSellerForm
          productId={product.id}
          productName={product.name}
          sellerId={product.seller_id}
        />
      </div>
      <BottomNav />
    </main>
  )
}
