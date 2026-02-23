'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url?: string | null
  created_at: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
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
      setProducts(data || [])
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
          <p className="text-muted-foreground">No products yet. Add products in your Supabase database.</p>
        </div>
      ) : (
        products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group block">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-40 bg-muted rounded-lg mb-4 flex items-center justify-center text-4xl text-muted-foreground">📦</div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description || ''}</p>
              <p className="text-xl font-bold text-primary">${product.price}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
