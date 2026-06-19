import { useNavigate } from 'react-router-dom'
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

  return (
    <div className={styles.card} onClick={handleCardClick}>

      {/* Service name */}
      <h3 className={styles.name}>{service.name}</h3>

      {/* Icon */}
      <span className={styles.emoji}>{service.emoji}</span>

      {/* Footer */}
      <div className={styles.footer}>

        {/* Bookmark */}
        <button
          className={`${styles.iconButton} ${isBookmarked ? styles.bookmarked : ''}`}
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this service'}
          title={user ? (isBookmarked ? 'Remove pin' : 'Pin this service') : 'Sign in to pin'}
        >
          {isBookmarked ? '🔖' : '🏷️'}
        </button>

        {/* Lock */}
        {service.protected && (
          <span
            className={`${styles.iconButton} ${user ? styles.unlocked : styles.locked}`}
            title={user ? 'You have access' : 'Sign in required'}
          >
            {user ? '🔓' : '🔒'}
          </span>
        )}

      </div>
    </div>
  )
}