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
      className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-border bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 translate-y-1 rounded-full bg-primary shadow-sm transition duration-200 ease-out ${
          isDark ? 'translate-x-1' : 'translate-x-7'
        }`}
      />
    </button>
  )
}
