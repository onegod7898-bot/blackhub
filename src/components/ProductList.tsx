'use client'

import { useEffect, useState } from 'react'
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
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No products found. Add some products to your Supabase database.
        </div>
      ) : (
        products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-40 bg-muted rounded-lg mb-4 flex items-center justify-center text-4xl">📦</div>
              )}
              <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{product.description || ''}</p>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
