import { createClient } from '@supabase/supabase-js'
import ProductDetailContent from '@/components/ProductDetailContent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { title: 'Product' }
  }
  const { data: product } = await supabase.from('products').select('id, name, price, image_url, description').eq('id', id).single()
  if (!product) return { title: 'Product Not Found' }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blackhub.vercel.app'
  const imageUrl = product.image_url || `${baseUrl}/logo.png`
  const desc = product.description ? `${product.description.slice(0, 155)}...` : `$${product.price} - View on BlackHub`
  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      url: `${baseUrl}/product/${id}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title: product.name, description: desc },
  }
}

export default function ProductPage() {
  return <ProductDetailContent />
}
