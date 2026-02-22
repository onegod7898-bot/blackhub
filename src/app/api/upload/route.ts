import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'products'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (!['avatars', 'products'].includes(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${bucket}/${user.id}/${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const client = supabaseAdmin || supabase
    const { data, error } = await client.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) throw error

    const { data: { publicUrl } } = client.storage.from(bucket).getPublicUrl(data.path)
    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
