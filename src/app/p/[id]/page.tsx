import { createClient } from '@supabase/supabase-js'
import ProductDetailContent from '@/components/ProductDetailContent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { title: 'Product | BlackHub' }
  }
  const { data: product } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .eq('id', id)
    .single()

  if (!product) return { title: 'Product Not Found | BlackHub' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blackhubapp.com'
  const url = `${baseUrl}/p/${id}`
  const imageUrl = product.image_url || `${baseUrl}/og-default.png`

  return {
    title: `${product.name} | BlackHub`,
    description: `$${product.price} - View on BlackHub marketplace`,
    openGraph: {
      title: product.name,
      description: `$${product.price} on BlackHub`,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
  }
}

export default function ProductSharePage() {
  return <ProductDetailContent />
}
