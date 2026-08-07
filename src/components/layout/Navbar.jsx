import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import styles from './Navbar.module.css'
import { Palette } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, themes, changeTheme } = useTheme()
  const [themeOpen, setThemeOpen] = useState(false)

  return (
    <nav className={styles.navbar}>

      {/* Left — Branding */}
      <Link to="/" className={styles.brand}>
        Twilit
      </Link>

      {/* Right — Controls */}
      <div className={styles.controls}>

        {/* Theme switcher — only visible when signed in */}
        {user && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setThemeOpen(prev => !prev)}
              aria-label="Switch theme"
            >
              <Palette size={16} /> <span className={styles.themeLabel}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </button>
            {themeOpen && (
              <ul className={styles.dropdownMenu}>
                {themes.map(t => (
                  <li key={t}>
                    <button
                      className={`${styles.dropdownItem} ${t === theme ? styles.active : ''}`}
                      onClick={() => {
                        changeTheme(t)
                        setThemeOpen(false)
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sign in / Sign out */}
        {user ? (
          <button className={styles.authButton} onClick={signOut}>
            Sign Out
          </button>
        ) : (
          <Link to="/signin" className={styles.authButton}>
            Sign In
          </Link>
        )}

      </div>
    </nav>
  )
}