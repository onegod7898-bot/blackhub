'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'

export default function SellerProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('profiles')
      .select('display_name, company_name, avatar_url')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProfile(data)
      })
    supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('seller_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data || [])
      })
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const sellerName = profile?.display_name || profile?.company_name || 'Seller'

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-card rounded-2xl border border-border p-6 text-center mb-6">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl mx-auto mb-4">👤</div>
          )}
          <h1 className="text-xl font-bold text-foreground">{sellerName}</h1>
          {profile?.company_name && profile?.display_name && (
            <p className="text-muted-foreground text-sm">{profile.company_name}</p>
          )}
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">Listings</h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products listed</p>
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
                    <p className="text-primary font-bold">${p.price}</p>
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
