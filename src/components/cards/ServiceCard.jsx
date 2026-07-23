import { useNavigate } from 'react-router-dom'
import { Bookmark, Lock, Unlock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ service, isBookmarked, onBookmark }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (service.protected && !user) {
      navigate('/signin')
      return
    }
    navigate(service.path)
  }

  const handleBookmark = (e) => {
    e.stopPropagation()
    if (!user) {
      navigate('/signin')
      return
    }
    onBookmark()
  }

  const Icon = service.icon

  return (
    <div className={styles.card} onClick={handleCardClick}>

      {/* Service name */}
      <h3 className={styles.name}>{service.name}</h3>

      {/* Icon */}
      <span className={styles.icon}>
        <Icon size={32} strokeWidth={1.75} />
      </span>

      {/* Footer */}
      <div className={styles.footer}>

        {/* Bookmark */}
        <button
          className={`${styles.iconButton} ${isBookmarked ? styles.bookmarked : ''}`}
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this service'}
          title={user ? (isBookmarked ? 'Remove pin' : 'Pin this service') : 'Sign in to pin'}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>

        {/* Lock */}
        {service.protected && (
          <span
            className={`${styles.iconButton} ${user ? styles.unlocked : styles.locked}`}
            title={user ? 'You have access' : 'Sign in required'}
          >
            {user ? <Unlock size={18} /> : <Lock size={18} />}
          </span>
        )}

      </div>
    </div>
  )
}