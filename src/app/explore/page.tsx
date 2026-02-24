'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'
import VerifiedBadge from '@/components/VerifiedBadge'

const CATEGORIES = ['all', 'electronics', 'fashion', 'home', 'sports', 'general']

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  seller_id: string
}

interface SellerInfo {
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
  verified_seller: boolean
}

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerInfo>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [submittedSearch, setSubmittedSearch] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [submittedSearch, category])

  async function fetchProducts() {
    setLoading(true)
    const params = new URLSearchParams()
    if (submittedSearch) params.set('search', submittedSearch)
    if (category !== 'all') params.set('category', category)
    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    const list = data.products || []
    setProducts(list)
    if (list.length > 0) {
      const ids = [...new Set(list.map((p: Product) => p.seller_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, company_name, avatar_url, verified_seller')
        .in('id', ids)
      const map: Record<string, SellerInfo> = {}
      ;(profiles || []).forEach((p) => { map[p.id] = p })
      setSellers(map)
    } else {
      setSellers({})
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background pb-24 animate-fade-in">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Logo className="shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSubmittedSearch(search)}
            placeholder="Search products..."
            className="flex-1 max-w-sm rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => setSubmittedSearch(search)}
            className="btn-primary rounded-xl px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold"
          >
            Search
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 overflow-x-auto flex gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              category === c
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4 sm:px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-3 space-y-2">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full skeleton" />
                    <div className="h-4 skeleton flex-1" />
                  </div>
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-5 skeleton w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-16 text-center text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const seller = sellers[p.seller_id]
              const sellerName = seller?.display_name || seller?.company_name || 'Seller'
              return (
                <Link key={p.id} href={`/product/${p.id}`} className="group block">
                  <div className="card-elevated rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">📦</span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {seller?.avatar_url ? (
                          <img src={seller.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {sellerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground truncate flex-1">{sellerName}</span>
                        {seller?.verified_seller && <VerifiedBadge size="sm" />}
                      </div>
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="text-base font-bold text-primary">${p.price}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
