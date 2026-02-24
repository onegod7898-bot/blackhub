'use client'

import Link from 'next/link'
import VerifiedBadge from '@/components/VerifiedBadge'

interface SellerInfo {
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
  verified_seller: boolean
}

interface ProductCardProps {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  seller?: SellerInfo
  rating?: number
}

export default function ProductCard({ id, name, price, image_url, seller, rating }: ProductCardProps) {
  const sellerName = seller?.display_name || seller?.company_name || 'Seller'

  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="card-elevated rounded-xl border border-border bg-card overflow-hidden">
        <div className="aspect-square bg-muted overflow-hidden relative">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">📦</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {sellerName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-muted-foreground truncate flex-1">{sellerName}</span>
            {seller?.verified_seller && <VerifiedBadge size="sm" />}
          </div>
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {name}
          </h3>
          {rating !== undefined && rating > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
          )}
          <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}
