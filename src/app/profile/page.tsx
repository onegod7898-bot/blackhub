'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'

function ProfileContent() {
  const [displayName, setDisplayName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isCEO, setIsCEO] = useState(false)
  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return
      const res = await fetch('/api/referral', { headers: { Authorization: `Bearer ${data.session.access_token}` } })
      if (res.ok) {
        const json = await res.json()
        setReferralLink(json.referralLink || '')
      }
    })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${data.session.access_token}` } })
      if (res.ok) {
        const { isCEO: ceo } = await res.json()
        setIsCEO(!!ceo)
      }
    })
  }, [])

  async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('profiles')
      .select('display_name, company_name, avatar_url')
      .eq('id', session.user.id)
      .single()
    if (data) {
      setDisplayName(data.display_name || '')
      setCompanyName(data.company_name || '')
      setAvatarUrl(data.avatar_url || '')
    }
    setLoading(false)
  }

  async function handleFileUpload(file: File) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'avatars')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: form,
      })
      const data = await res.json()
      if (data.url) setAvatarUrl(data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        company_name: companyName || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
    setSaving(false)
    if (error) {
      setMessage(error.message)
      return
    }
    setMessage('Profile saved.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="nav-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 lg:h-16 items-center justify-between">
            <Logo />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Business Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Profile image</label>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl">👤</div>
              )}
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="text-foreground text-sm" />
              {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Company name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
              placeholder="Company or brand" />
          </div>
          {message && (
            <p className={`text-sm ${message.startsWith('Profile') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>
          )}
          {referralLink && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <label className="block text-sm font-medium text-foreground mb-2">Your referral link</label>
              <p className="text-xs text-muted-foreground mb-2">Earn commission when sellers sign up with your link.</p>
              <div className="flex gap-2">
                <input readOnly value={referralLink} className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground" />
                <button type="button" onClick={() => { navigator.clipboard.writeText(referralLink); setMessage('Link copied!'); setTimeout(() => setMessage(''), 2000); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                  Copy
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving}
              className="btn-saas px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save profile'}
            </button>
            <Link href="/dashboard" className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted">
              Back to dashboard
            </Link>
            {isCEO && (
              <Link href="/bh-portal" className="px-4 py-2 border border-primary/50 text-primary rounded-xl hover:bg-primary/10 transition-colors">
                Admin Portal
              </Link>
            )}
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
