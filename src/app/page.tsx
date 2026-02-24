'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
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

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerInfo>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          fetch('/api/products?category=general'),
          fetch('/api/products'),
        ])
        const featuredData = await featuredRes.json()
        const trendingData = await trendingRes.json()
        const fList = (featuredData.products || []).slice(0, 8)
        const tList = (trendingData.products || []).slice(0, 8)
        setFeatured(fList)
        setTrending(tList)
        const ids = [...new Set([...fList, ...tList].map((p: Product) => p.seller_id))]
        if (ids.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, company_name, avatar_url, verified_seller')
            .in('id', ids)
          const map: Record<string, SellerInfo> = {}
          ;(profiles || []).forEach((p: { id: string } & SellerInfo) => { map[p.id] = p })
          setSellers(map)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-background pb-24">
      <Navbar transparent />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero: Large search */}
        <section className="pt-16 pb-20 lg:pt-20 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-hero font-bold tracking-tight text-heading animate-fade-in">
              The premium marketplace for{' '}
              <span className="text-primary">global sellers</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground animate-fade-in-delay-1">
              Discover digital products, services, and subscriptions. List once, sell everywhere.
            </p>
          </div>
          <div className="max-w-3xl mx-auto animate-fade-in-delay-2">
            <SearchBar large />
          </div>
        </section>

        {/* Categories: horizontal scroll */}
        <section className="py-6 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/explore?category=${c.id}`}
                className="shrink-0 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured services */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section font-bold text-heading">Featured</h2>
            <Link href="/explore" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
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
          ) : featured.length === 0 ? (
            <EmptyState
              title="No featured products yet"
              description="Sellers are listing products. Check back soon or browse all categories."
              ctaLabel="Explore marketplace"
              ctaHref="/explore"
              illustration="products"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p) => (
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
        </section>

        {/* Trending digital products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section font-bold text-heading">Trending</h2>
            <Link href="/explore" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
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
          ) : trending.length === 0 ? (
            <EmptyState
              title="No trending products"
              description="New products are added daily. Be the first to discover them."
              ctaLabel="Explore marketplace"
              ctaHref="/explore"
              illustration="products"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {trending.map((p) => (
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
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="rounded-2xl border border-border bg-card p-8 lg:p-12 text-center card-elevated">
            <h2 className="text-section font-bold text-heading mb-4">Ready to sell?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-base">
              Join thousands of sellers. List products, get subscribers, grow your business. 7-day free trial.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
        <Link
                  href="/signup"
                  className="btn-primary inline-flex items-center rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground"
                >
                  Start free trial
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary inline-flex items-center rounded-2xl border border-border px-8 py-4 text-base font-bold text-foreground"
                >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  )
}
