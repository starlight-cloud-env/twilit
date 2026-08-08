import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, LogIn } from 'lucide-react'
import { useAuth } from '../../../../context/AuthContext.jsx'
import styles from './Leaderboard.module.css'

export default function Leaderboard({ leaderboard, loading, personalBest, fetchLeaderboard }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchLeaderboard()
  }, [user, personalBest])

  if (!user) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.title}>
          <Trophy size={16} /> Leaderboard
        </h2>
        <div className={styles.signInPrompt}>
          <p className={styles.stateText}>Sign in to view the leaderboard and save your best score.</p>
          <Link to="/signin" className={styles.signInButton}>
            <LogIn size={14} /> Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Trophy size={16} /> Leaderboard
        </h2>
        <span className={styles.personalBest}>Your best: {personalBest}</span>
      </div>

      {loading ? (
        <p className={styles.stateText}>Loading scores...</p>
      ) : leaderboard.length === 0 ? (
        <p className={styles.stateText}>No scores yet — be the first!</p>
      ) : (
        <div className={styles.list}>
          {leaderboard.map((entry, i) => {
            const isMe = entry.user_id === user.id
            const displayName = entry.profiles?.email?.split('@')[0] ?? 'Player'
            return (
              <div key={entry.user_id} className={`${styles.row} ${isMe ? styles.me : ''}`}>
                <span className={styles.rank}>#{i + 1}</span>
                <div className={styles.info}>
                  <span className={styles.name}>{displayName}{isMe ? ' (you)' : ''}</span>
                  <span className={styles.wave}>Wave {entry.highest_wave}</span>
                </div>
                <span className={styles.score}>{entry.score}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}