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

interface SellerInfo {
  id: string
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
  verified_seller: boolean
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerInfo>>({})
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
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, company_name, avatar_url, verified_seller')
          .in('id', sellerIds)
        const map: Record<string, SellerInfo> = {}
        ;(profiles || []).forEach((p) => { map[p.id] = p })
        setSellers(map)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-[4/3] skeleton" />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="flex-1">
                  <div className="h-4 skeleton w-24 mb-2" />
                  <div className="h-3 skeleton w-16" />
                </div>
              </div>
              <div className="h-4 skeleton w-full" />
              <div className="h-5 skeleton w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full rounded-xl border border-border bg-card p-16 text-center">
          <p className="text-muted-foreground mb-2">No products listed yet.</p>
          <p className="text-sm text-muted-foreground mb-8">Sellers can list products from their dashboard. Sign up as a seller to get started with a 7-day free trial.</p>
          <Link href="/signup" className="btn-primary inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95">
            Sign up to list products
          </Link>
        </div>
      ) : (
        products.map((product) => {
          const seller = sellers[product.seller_id]
          const sellerName = seller?.display_name || seller?.company_name || 'Seller'
          return (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="card-elevated rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-muted-foreground">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {seller?.avatar_url ? (
                      <img src={seller.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {sellerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground truncate flex-1">{sellerName}</span>
                    {seller?.verified_seller && <VerifiedBadge size="sm" />}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description || ''}</p>
                  <p className="text-lg font-bold text-primary">${product.price}</p>
                </div>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
