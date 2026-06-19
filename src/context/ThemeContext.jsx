import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const THEMES = ['aurora', 'solar', 'lunar', 'eclipse']
const DEFAULT_THEME = 'aurora'
const STORAGE_KEY = 'twilit-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [theme, setTheme] = useState(DEFAULT_THEME)

  // On mount, load saved theme from localStorage if it exists
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.includes(saved)) {
      setTheme(saved)
    }
  }, [])

  // Apply theme to the html element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // When user signs out, revert to aurora
  useEffect(() => {
    if (!user) {
      setTheme(DEFAULT_THEME)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const changeTheme = (newTheme) => {
    if (!user) return // guests cannot change theme
    if (!THEMES.includes(newTheme)) return
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
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