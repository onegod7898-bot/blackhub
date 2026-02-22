'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import Link from 'next/link'
import SubscribedRoute from '@/components/SubscribedRoute'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'

const CATEGORIES = ['general', 'electronics', 'fashion', 'home', 'sports']

interface Listing {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  created_at: string
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('general')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/listings', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const data = await res.json()
    if (data.listings) setListings(data.listings)
    setLoading(false)
  }

  async function handleFileUpload(file: File) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return ''
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'products')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: form,
      })
      const data = await res.json()
      if (data.url) setImageUrl(data.url)
      return data.url || ''
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setSaving(true)
    try {
      const payload = { name, description: description || null, price: Number(price), category, image_url: imageUrl || null }
      if (editingId) {
        const res = await fetch(`/api/listings/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error((await res.json()).error)
      } else {
        const res = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify(payload),
        })
        const created = await res.json()
        if (!res.ok) throw new Error(created.error)
        if (created?.listing) analytics.productCreated({ productId: created.listing.id, category })
      }
      setName('')
      setDescription('')
      setPrice('')
      setImageUrl('')
      setCategory('general')
      setEditingId(null)
      setShowForm(false)
      fetchListings()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing?')) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (res.ok) fetchListings()
    else alert((await res.json()).error)
  }

  function startEdit(l: Listing) {
    setEditingId(l.id)
    setName(l.name)
    setDescription(l.description || '')
    setPrice(String(l.price))
    setCategory(l.category || 'general')
    setImageUrl(l.image_url || '')
    setShowForm(true)
  }

  return (
    <SubscribedRoute>
      <div className="min-h-screen bg-background pb-24">
        <nav className="bg-card border-b border-border px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-foreground">BlackHub Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-muted-foreground hover:text-foreground">
              Logout
            </button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">My Listings</h2>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Products</h3>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setName(''); setDescription(''); setPrice(''); setImageUrl(''); setCategory('general'); }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Add listing
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product image</label>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="text-foreground" />
                  {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                  {imageUrl && <img src={imageUrl} alt="" className="mt-2 w-24 h-24 object-cover rounded" />}
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product title"
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  rows={2}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
                    {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 border border-border rounded-lg text-foreground">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p className="text-muted-foreground">Loading listings...</p>
            ) : listings.length === 0 ? (
              <p className="text-muted-foreground">No listings yet. Add one above.</p>
            ) : (
              <ul className="space-y-4">
                {listings.map((l) => (
                  <li key={l.id} className="bg-card p-4 rounded-xl border border-border flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      {l.image_url ? (
                        <img src={l.image_url} alt={l.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-2xl">📦</div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-medium text-foreground">{l.name}</h4>
                        {l.description && <p className="text-sm text-muted-foreground truncate">{l.description}</p>}
                        <p className="text-lg font-semibold text-primary">${l.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(l)} className="px-3 py-1 text-sm border border-border rounded text-foreground">Edit</button>
                      <button onClick={() => handleDelete(l.id)} className="px-3 py-1 text-sm text-red-500 border border-red-500/50 rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      <BottomNav />
    </SubscribedRoute>
  )
}
