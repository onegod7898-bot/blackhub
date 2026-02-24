import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://blackhub.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/refunds`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (url && key) {
    try {
      const supabase = createClient(url, key)
      const { data: products } = await supabase.from('products').select('id, updated_at').limit(500)
      productPages = (products || []).map((p) => ({
        url: `${BASE_URL}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    } catch {
      // ignore
    }
  }

  return [...staticPages, ...productPages]
}
