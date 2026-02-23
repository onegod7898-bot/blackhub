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
    <main className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4">
        <Logo className="shrink-0" />
        <ThemeToggle />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSubmittedSearch(search)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
        />
        <button onClick={() => setSubmittedSearch(search)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
          Search
        </button>
      </div>

      <div className="p-4 overflow-x-auto flex gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="block">
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-muted-foreground">📦</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-foreground truncate">{p.name}</h3>
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
