'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import ThemeToggle from '@/components/ThemeToggle'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats')

  useEffect(() => {
    loadStats()
    loadUsers()
  }, [])

  async function loadStats() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.status === 403) {
        setError('Access denied. CEO only.')
        setLoading(false)
        return
      }
      if (!res.ok) {
        setError((await res.json()).error || 'Failed to load stats')
        setLoading(false)
        return
      }
      const data = await res.json()
      setStats(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadUsers() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users || [])
    }
  }

  async function toggleSuspend(userId: string, suspended: boolean) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const endpoint = suspended ? 'unsuspend' : 'suspend'
    const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (res.ok) loadUsers()
    else alert((await res.json()).error)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6 pb-24">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Panel (CEO Only)</h1>
            <button onClick={() => router.push('/dashboard')} className="text-primary hover:underline">
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'stats' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Users
            </button>
          </div>

          {loading && activeTab === 'stats' && <p className="text-muted-foreground">Loading...</p>}

          {activeTab === 'stats' && stats && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Total Users</h2>
                <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Total Sellers</h2>
                <p className="text-3xl font-bold text-foreground">{stats.totalSellers ?? 0}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Active Subscriptions</h2>
                <p className="text-3xl font-bold text-foreground">{stats.activeSubscriptions}</p>
                <p className="text-sm text-muted-foreground mt-1">trialing + active</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Trial Users</h2>
                <p className="text-3xl font-bold text-foreground">{stats.trialing}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Total Revenue</h2>
                <p className="text-3xl font-bold text-foreground">
                  {(stats.revenueCents / 100).toLocaleString()} <span className="text-lg font-normal text-muted-foreground">cents</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">from active paid subscriptions</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">New Users (7 days)</h2>
                <p className="text-3xl font-bold text-foreground">{stats.newUsersLast7Days}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-foreground font-medium">Email</th>
                      <th className="text-left p-4 text-foreground font-medium">Role</th>
                      <th className="text-left p-4 text-foreground font-medium">Country</th>
                      <th className="text-left p-4 text-foreground font-medium">Suspended</th>
                      <th className="text-left p-4 text-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border">
                        <td className="p-4 text-foreground">{u.email || u.id}</td>
                        <td className="p-4 text-muted-foreground">{u.role || '-'}</td>
                        <td className="p-4 text-muted-foreground">{u.country || '-'}</td>
                        <td className="p-4">{u.suspended ? <span className="text-red-500">Yes</span> : <span className="text-green-500">No</span>}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleSuspend(u.id, u.suspended)}
                            className={`px-3 py-1 text-sm rounded ${u.suspended ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}
                          >
                            {u.suspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
