'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const POPULAR_SEARCHES = ['Digital products', 'Design services', 'Consulting', 'Courses', 'Software', 'Templates']
const TOP_CATEGORIES = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'digital', label: 'Digital' },
  { id: 'services', label: 'Services' },
  { id: 'general', label: 'General' },
]
const RECENT_KEY = 'blackhub-recent-searches'
const MAX_RECENT = 5

interface SearchBarProps {
  defaultValue?: string
  onSearch?: (q: string) => void
  large?: boolean
  className?: string
}

export default function SearchBar(props: SearchBarProps) {
  const { defaultValue = '', onSearch, large = false, className = '' } = props
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const loadRecent = useCallback(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [])
      } else {
        setRecentSearches([])
      }
    } catch {
      setRecentSearches([])
    }
  }, [])

  const saveRecent = useCallback((term: string) => {
    if (!term.trim()) return
    const trimmed = term.trim()
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => { loadRecent() }, [loadRecent])

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/products?search=' + encodeURIComponent(query))
        const data = (await res.json()) as { products?: { name: string }[] }
        const products = data.products || []
        const names: string[] = [...new Set(products.slice(0, 6).map((p) => p.name))]
        setSuggestions(names)
      } catch { setSuggestions([]) }
      finally { setLoading(false) }
    }, 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (term?: string) => {
    const q = (term ?? query).trim()
    if (!q) return
    saveRecent(q)
    setIsOpen(false)
    if (onSearch) onSearch(q)
    else router.push('/explore?q=' + encodeURIComponent(q))
  }

  const handleCategory = (catId: string) => {
    setIsOpen(false)
    router.push('/explore?category=' + catId)
  }

  const showDropdown = isOpen
  const showPopular = isOpen && !query.trim() && recentSearches.length === 0
  const showRecent = isOpen && !query.trim() && recentSearches.length > 0
  const showCategories = isOpen && !query.trim()

  return (
    <div ref={containerRef} className={'relative w-full ' + className}>
      <div className={'relative flex items-center rounded-xl border border-border bg-card transition-all duration-200 ' + (isOpen ? 'ring-2 ring-primary/30 border-primary/50 ' : 'hover:border-[var(--muted-foreground)]/30 ') + (large ? 'h-14 px-5' : 'h-12 px-4')}>
        <svg className="w-5 h-5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Search products, services, sellers..."
          className={'flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground ml-3 ' + (large ? 'text-lg' : 'text-base')}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        {loading && <div className="spinner w-5 h-5 shrink-0 ml-2" />}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-50 animate-dropdown" role="listbox">
          {query.trim() && suggestions.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggestions</p>
              {suggestions.map((s, i) => (
                <button key={s} type="button" onClick={() => handleSubmit(s)} className="w-full px-4 py-3 text-left text-foreground hover:bg-muted/80 transition-colors flex items-center gap-3 animate-suggestion-item" style={{ animationDelay: `${i * 30}ms` }} role="option">
                  <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          )}
          {query.trim() && suggestions.length === 0 && !loading && (
            <div className="px-4 py-6 text-center">
              <p className="text-muted-foreground text-sm">No results for {query}</p>
              <button type="button" onClick={() => handleSubmit()} className="mt-3 text-primary font-medium text-sm hover:underline">Search anyway</button>
            </div>
          )}
          {showPopular && (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Trending</p>
              <div className="flex flex-wrap gap-2 p-3">
                {POPULAR_SEARCHES.map((s, i) => (
                  <button key={s} type="button" onClick={() => handleSubmit(s)} className="px-4 py-2 rounded-xl bg-muted/60 text-foreground text-sm font-medium hover:bg-primary/20 hover:text-primary transition-all animate-suggestion-item" style={{ animationDelay: `${i * 40}ms` }} role="option">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showCategories && (
            <div className="py-2 border-t border-border">
              <p className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Top categories</p>
              <div className="flex flex-wrap gap-2 p-3">
                {TOP_CATEGORIES.map((c, i) => (
                  <button key={c.id} type="button" onClick={() => handleCategory(c.id)} className="px-4 py-2 rounded-xl bg-muted/60 text-foreground text-sm font-medium hover:bg-primary/20 hover:text-primary transition-all animate-suggestion-item" style={{ animationDelay: `${i * 40}ms` }} role="option">
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showRecent && (
            <div className="py-2 border-t border-border">
              <p className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent</p>
              {recentSearches.map((s, i) => (
                <button key={s} type="button" onClick={() => handleSubmit(s)} className="w-full px-4 py-3 text-left text-foreground hover:bg-muted/80 transition-colors flex items-center gap-3 animate-suggestion-item" style={{ animationDelay: `${i * 30}ms` }} role="option">
                  <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" aria-hidden onClick={() => setIsOpen(false)} />}
    </div>
  )
}
