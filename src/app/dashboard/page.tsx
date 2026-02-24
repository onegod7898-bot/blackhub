'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import Link from 'next/link'
import SubscribedRoute from '@/components/SubscribedRoute'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

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

interface Analytics {
  revenue: number
  customers: number
  salesCount: number
  chartData: { date: string; revenue: number }[]
  transactions: { id: string; status: string; date: string; amount: string }[]
}

interface Referral {
  referralCode: string
  referralLink: string
  totalEarnings: number
  earnings: { amount: number; source: string; date: string }[]
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [analyticsData, setAnalyticsData] = useState<Analytics | null>(null)
  const [referralData, setReferralData] = useState<Referral | null>(null)
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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const token = session.access_token
    const [listRes, analyticsRes, referralRes] = await Promise.all([
      fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/analytics', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/referral', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    const listData = await listRes.json()
    const analyticsJson = await analyticsRes.json()
    const referralJson = await referralRes.json()
    if (listData.listings) setListings(listData.listings)
    setAnalyticsData(analyticsJson)
    setReferralData(referralJson)
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
      fetchAll()
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
    if (res.ok) fetchAll()
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

  function copyReferralLink() {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const maxChart = analyticsData?.chartData?.length ? Math.max(...analyticsData.chartData.map((d) => d.revenue), 1) : 1

  return (
    <SubscribedRoute>
      <div className="min-h-screen bg-background pb-24 animate-fade-in">
        <header className="sticky top-0 z-50 nav-premium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 lg:h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-sm text-muted-foreground hidden sm:inline">Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Logout
              </button>
            </div>
          </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Analytics cards */}
          {analyticsData && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Analytics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                  <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${analyticsData.revenue.toFixed(2)}</p>
                </div>
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                  <p className="text-sm text-muted-foreground mb-1">Customers</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.customers}</p>
                </div>
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                  <p className="text-sm text-muted-foreground mb-1">Sales</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.salesCount}</p>
                </div>
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                  <p className="text-sm text-muted-foreground mb-1">Listings</p>
                  <p className="text-2xl font-bold text-foreground">{listings.length}</p>
                </div>
              </div>
              {analyticsData.chartData?.length > 0 && (
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Revenue (last 7 days)</h3>
                  <div className="flex items-end gap-2 h-32">
                    {analyticsData.chartData.map((d, i) => (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-primary/60 min-h-[4px] transition-all duration-300"
                          style={{ height: `${(d.revenue / maxChart) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{d.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analyticsData.transactions?.length > 0 && (
                <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Recent transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.transactions.slice(0, 5).map((t) => (
                          <tr key={t.id} className="border-b border-border/50">
                            <td className="py-3 text-foreground font-mono text-xs">{t.id.slice(0, 12)}...</td>
                            <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${t.status === 'pending' ? 'bg-amber-500/20 text-amber-600' : 'bg-green-500/20 text-green-600'}`}>{t.status}</span></td>
                            <td className="py-3 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Referral section */}
          {referralData && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Referral program</h2>
              <div className="card-feature rounded-2xl border border-border bg-card p-6 glass">
                <p className="text-sm text-muted-foreground mb-2">Share your link. Earn ₦5 or $0.05 for every seller who signs up.</p>
                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    readOnly
                    value={referralData.referralLink}
                    className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm"
                  />
                  <button onClick={copyReferralLink} className="btn-saas rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
                <p className="mt-4 text-lg font-bold text-primary">Total earnings: ${referralData.totalEarnings.toFixed(2)}</p>
              </div>
            </section>
          )}

          {/* Listings */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">My Listings</h2>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setName(''); setDescription(''); setPrice(''); setImageUrl(''); setCategory('general'); }}
                className="btn-saas rounded-xl px-5 py-3 bg-primary text-primary-foreground font-semibold shadow-sm hover:shadow-primary/25 w-full sm:w-auto"
              >
                + List product
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="card-feature rounded-2xl border border-border bg-card p-6 glass mb-8 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{editingId ? 'Edit listing' : 'New listing'}</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product image</label>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="text-foreground text-sm" />
                  {uploading && <span className="text-sm text-muted-foreground ml-2">Uploading...</span>}
                  {imageUrl && <img src={imageUrl} alt="" className="mt-2 w-24 h-24 object-cover rounded-xl" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wireless headphones" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground" rows={3} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price ($)</label>
                    <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-saas rounded-xl px-5 py-2.5 bg-primary text-primary-foreground font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : editingId ? 'Update listing' : 'Create listing'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-xl px-5 py-2.5 border border-border text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : listings.length === 0 ? (
              <div className="card-feature rounded-2xl border border-border bg-card p-12 text-center glass">
                <p className="text-muted-foreground mb-6">You haven't listed any products yet.</p>
                <button onClick={() => { setShowForm(true); setEditingId(null); setName(''); setDescription(''); setPrice(''); setImageUrl(''); setCategory('general'); }} className="btn-saas rounded-xl px-6 py-3 bg-primary text-primary-foreground font-semibold shadow-sm hover:shadow-primary/25">
                  + List your first product
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="space-y-4">
                  {listings.map((l) => (
                    <li key={l.id} className="card-feature rounded-2xl border border-border bg-card p-4 glass flex justify-between items-start gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        {l.image_url ? <img src={l.image_url} alt={l.name} className="w-16 h-16 object-cover rounded-xl" /> : <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-2xl">📦</div>}
                        <div className="min-w-0">
                          <h4 className="font-medium text-foreground">{l.name}</h4>
                          {l.description && <p className="text-sm text-muted-foreground truncate">{l.description}</p>}
                          <p className="text-lg font-semibold text-primary">${l.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEdit(l)} className="rounded-xl px-3 py-1.5 text-sm border border-border text-foreground hover:bg-muted transition-colors">Edit</button>
                        <button onClick={() => handleDelete(l.id)} className="rounded-xl px-3 py-1.5 text-sm text-red-500 border border-red-500/50 hover:bg-red-500/10 transition-colors">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowForm(true); setEditingId(null); setName(''); setDescription(''); setPrice(''); setImageUrl(''); setCategory('general'); }} className="rounded-xl px-4 py-2.5 border border-border text-foreground hover:bg-muted font-medium transition-colors">
                  + Add another listing
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      <BottomNav />
    </SubscribedRoute>
  )
}
