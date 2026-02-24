'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import VerifiedBadge from '@/components/VerifiedBadge'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url?: string | null
  created_at: string
  seller_id: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [verifiedSellers, setVerifiedSellers] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const list = data || []
      setProducts(list)
      const sellerIds = [...new Set(list.map((p) => p.seller_id))]
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, verified_seller').in('id', sellerIds)
        const map: Record<string, boolean> = {}
        ;(profiles || []).forEach((p) => { map[p.id] = !!p.verified_seller })
        setVerifiedSellers(map)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
            <div className="h-40 rounded-lg bg-muted mb-4" />
            <div className="h-5 rounded bg-muted mb-2 w-3/4" />
            <div className="h-4 rounded bg-muted mb-4 w-full" />
            <div className="h-6 rounded bg-muted w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No products listed yet.</p>
          <p className="text-sm text-muted-foreground mb-6">Sellers can list products from their dashboard. Sign up as a seller to get started with a 7-day free trial.</p>
          <Link href="/signup" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95">
            Sign up to list products
          </Link>
        </div>
      ) : (
        products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group block">
            <div className="card-feature rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-40 bg-muted/80 rounded-lg mb-4 flex items-center justify-center text-4xl text-muted-foreground">📦</div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                {verifiedSellers[product.seller_id] && <VerifiedBadge size="sm" />}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description || ''}</p>
              <p className="text-xl font-bold text-primary">${product.price}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
