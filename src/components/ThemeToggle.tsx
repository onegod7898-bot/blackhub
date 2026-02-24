'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-xl border border-border bg-muted transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 translate-y-1 rounded-lg bg-primary shadow-sm transition-all duration-300 ease-out ${
          isDark ? 'translate-x-1' : 'translate-x-8'
        }`}
      />
    </button>
  )
}
