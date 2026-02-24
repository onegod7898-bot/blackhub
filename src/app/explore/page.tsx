'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home', label: 'Home' },
  { id: 'sports', label: 'Sports' },
  { id: 'general', label: 'General' },
  { id: 'digital', label: 'Digital' },
  { id: 'services', label: 'Services' },
]

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const qParam = searchParams.get('q') || ''
  const catParam = searchParams.get('category') || 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerInfo>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(qParam)
  const [category, setCategory] = useState(catParam)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    try {
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
        ;(profiles || []).forEach((p: { id: string } & SellerInfo) => { map[p.id] = p })
        setSellers(map)
      } else {
        setSellers({})
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    setSearch(qParam)
    setCategory(catParam)
  }, [qParam, catParam])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <main className="min-h-screen bg-background pb-24 animate-fade-in">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-xl nav-premium">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center gap-4">
            <Logo className="shrink-0" />
            <div className="flex-1 max-w-xl">
              <SearchBar
                defaultValue={qParam}
                onSearch={(q) => {
                  setSearch(q)
                  const params = new URLSearchParams()
                  if (q) params.set('q', q)
                  if (category !== 'all') params.set('category', category)
                  router.push(`/explore?${params}`)
                }}
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id)
                const params = new URLSearchParams()
                if (search) params.set('q', search)
                if (c.id !== 'all') params.set('category', c.id)
                router.push(`/explore?${params}`)
              }}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full skeleton" />
                      <div className="h-4 skeleton flex-1" />
                    </div>
                    <div className="h-4 skeleton w-3/4" />
                    <div className="h-5 skeleton w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description={search ? `No results for "${search}". Try a different search or browse categories.` : 'No products in this category yet. Check back soon.'}
              ctaLabel="Browse all"
              ctaHref="/explore"
              illustration="search"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  price={p.price}
                  image_url={p.image_url}
                  seller={sellers[p.seller_id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
