import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import styles from './SignIn.module.css'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${from}`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {sent ? (
          <>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              We sent a magic link to <strong>{email}</strong>.
              Click it to sign in — you can close this tab.
            </p>
            <button
              className={styles.back}
              onClick={() => navigate('/')}
            >
              ← Back to Twilit
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Welcome to Twilit</h1>
            <p className={styles.subtitle}>
              Sign in with your email to continue
            </p>

            <div className={styles.form}>
              <input
                type="email"
                placeholder="your@email.com"
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                className={styles.button}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </div>

            {error && (
              <p className={styles.error}>{error}</p>
            )}

            <button
              className={styles.back}
              onClick={() => navigate('/')}
            >
              ← Back to Twilit
            </button>
          </>
        )}

      </div>
    </div>
  )
}