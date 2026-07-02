import { useEffect, useState } from 'react'

const STORAGE_KEY = 'builder-theme'

function readTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function initThemeFromStorage() {
  const mode = readTheme()
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
