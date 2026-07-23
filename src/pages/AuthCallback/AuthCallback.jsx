import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import styles from './AuthCallback.module.css'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          return
        }

        if (data?.session) {
          setStatus('success')

          // Read the intended destination from the URL hash or default to home
          const params = new URLSearchParams(window.location.search)
          const redirectTo = params.get('redirectTo') || '/'

          setTimeout(() => {
            navigate(redirectTo, { replace: true })
          }, 1500)
          return
        }

        // No session yet — listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              setStatus('success')
              subscription.unsubscribe()

              const params = new URLSearchParams(window.location.search)
              const redirectTo = params.get('redirectTo') || '/'

              setTimeout(() => {
                navigate(redirectTo, { replace: true })
              }, 1500)
            }
          }
        )

        // Cleanup if component unmounts
        return () => subscription.unsubscribe()

      } catch (err) {
        console.error('Unexpected auth error:', err)
        setStatus('error')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === 'verifying' && (
          <>
            <div className={styles.spinner} />
            <h1 className={styles.title}>Signing you in...</h1>
            <p className={styles.subtitle}>Just a moment</p>
          </>
        )}
        {status === 'success' && (
          <>
            <span className={styles.successIcon}><CheckCircle2 size={40} /></span>
            <h1 className={styles.title}>You're signed in</h1>
            <p className={styles.subtitle}>Taking you there now...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <span className={styles.errorIcon}><XCircle size={32} /></span>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.subtitle}>Your link may have expired or already been used.</p>
            <button className={styles.button} onClick={() => navigate('/signin')}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}