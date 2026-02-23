'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

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

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([])
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
    setProducts(data.products || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background pb-24 animate-fade-in">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Logo className="shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSubmittedSearch(search)}
            placeholder="Search products..."
            className="flex-1 max-w-xs rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={() => setSubmittedSearch(search)} className="rounded-xl px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
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
            className={`rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4 sm:px-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-5 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group block">
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-muted-foreground">📦</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-lg font-bold text-primary">${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
