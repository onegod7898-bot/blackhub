'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

interface Message {
  id: string
  body: string
  read: boolean
  created_at: string
  product_id: string | null
  sender_id: string
  receiver_id: string
}

interface ProfileRow {
  id: string
  display_name: string | null
  company_name: string | null
}

export default function MessagesPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [profiles, setProfiles] = useState<Record<string, ProfileRow>>({})
  const [products, setProducts] = useState<Record<string, { name: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        setLoading(false)
        return
      }
      const { messages: msgs } = await res.json()
      setMessages(msgs || [])

      const profileIds = new Set<string>()
      const productIds = new Set<string>()
      msgs?.forEach((m: Message) => {
        profileIds.add(m.sender_id)
        profileIds.add(m.receiver_id)
        if (m.product_id) productIds.add(m.product_id)
      })
      if (profileIds.size > 0) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, display_name, company_name')
          .in('id', [...profileIds])
        const profMap: Record<string, ProfileRow> = {}
        profs?.forEach((p: ProfileRow) => {
          profMap[p.id] = p
        })
        setProfiles(profMap)
      }
      if (productIds.size > 0) {
        const { data: prods } = await supabase.from('products').select('id, name').in('id', [...productIds])
        const prodMap: Record<string, { name: string }> = {}
        prods?.forEach((p: { id: string; name: string }) => {
          prodMap[p.id] = { name: p.name }
        })
        setProducts(prodMap)
      }
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <ProtectedRoute>
      <MessagesContent
        userId={userId}
        messages={messages}
        profiles={profiles}
        products={products}
        loading={loading}
      />
    </ProtectedRoute>
  )
}

function MessagesContent({
  userId,
  messages,
  profiles,
  products,
  loading,
}: {
  userId: string | null
  messages: Message[]
  profiles: Record<string, ProfileRow>
  products: Record<string, { name: string }>
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <nav className="border-b border-border px-4 py-3 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </nav>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>
        {messages.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">No messages yet.</p>
            <p className="text-sm text-muted-foreground">When buyers contact you about a product, or when you message sellers, they will appear here.</p>
            <Link href="/explore" className="inline-block mt-4 text-primary hover:underline">Browse products</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => {
              const otherId = m.sender_id === userId ? m.receiver_id : m.sender_id
              const other = profiles[otherId]
              const name = other?.display_name || other?.company_name || 'User'
              const productName = m.product_id ? products[m.product_id]?.name : null
              const isFromMe = m.sender_id === userId
              return (
                <div key={m.id} className={`bg-card rounded-xl border border-border p-4 ${!m.read && m.receiver_id === userId ? 'border-l-4 border-l-primary' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">
                        {isFromMe ? 'To: ' : 'From: '}{name}
                      </p>
                      {productName && (
                        <p className="text-sm text-muted-foreground">Re: {productName}</p>
                      )}
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{m.body}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">
                      {new Date(m.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
