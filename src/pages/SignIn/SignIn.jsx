import { useNavigate } from 'react-router-dom'
import styles from './SignIn.module.css'

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>Welcome to Twilit</h1>
        <p className={styles.subtitle}>
          Sign in with your email to continue
        </p>

        {/* Magic link form — wired to Supabase in Phase 4 */}
        <div className={styles.form}>
          <input
            type="email"
            placeholder="your@email.com"
            className={styles.input}
          />
          <button className={styles.button}>
            Send Magic Link
          </button>
        </div>

        <button
          className={styles.back}
          onClick={() => navigate('/')}
        >
          ← Back to Twilit
        </button>

      </div>
    </div>
  )
}