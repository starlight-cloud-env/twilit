import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const THEMES = ['aurora', 'solar', 'lunar', 'eclipse']
const DEFAULT_THEME = 'aurora'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [theme, setTheme] = useState(DEFAULT_THEME)

  // Derive a storage key per user so each user's preference is saved separately
  const storageKey = user ? `twilit-theme-${user.id}` : null

  // When user state resolves, load their saved theme
  useEffect(() => {
    if (!user) {
      setTheme(DEFAULT_THEME)
      document.documentElement.setAttribute('data-theme', DEFAULT_THEME)
      return
    }

    const saved = localStorage.getItem(`twilit-theme-${user.id}`)
    if (saved && THEMES.includes(saved)) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      setTheme(DEFAULT_THEME)
      document.documentElement.setAttribute('data-theme', DEFAULT_THEME)
    }
  }, [user])

  // Apply theme to html element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const changeTheme = (newTheme) => {
    if (!user) return
    if (!THEMES.includes(newTheme)) return
    setTheme(newTheme)
    localStorage.setItem(`twilit-theme-${user.id}`, newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, themes: THEMES, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}