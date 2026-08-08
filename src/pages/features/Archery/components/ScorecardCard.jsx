import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Target } from 'lucide-react'
import styles from './ScorecardCard.module.css'

export default function ScorecardCard({ scorecard, onDelete }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete()
  }

  const date = new Date(scorecard.created_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className={styles.card} onClick={() => navigate(`/archery/${scorecard.id}`)}>

      <div className={styles.header}>
        <span className={styles.mode}>
          <Target size={12} />
          {scorecard.mode === 'indoor' ? 'Indoor' : 'Outdoor'}
        </span>
      </div>

      <h3 className={styles.name}>{scorecard.name}</h3>
      <span className={styles.date}>{date}</span>

      {confirming ? (
        <div className={styles.confirmRow} onClick={e => e.stopPropagation()}>
          <span className={styles.confirmText}>Delete?</span>
          <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : 'Yes'}
          </button>
          <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
            No
          </button>
        </div>
      ) : (
        <button
          className={styles.deleteButton}
          onClick={(e) => { e.stopPropagation(); setConfirming(true) }}
          aria-label="Delete scorecard"
          title="Delete scorecard"
        >
          <Trash2 size={14} />
        </button>
      )}

    </div>
  )
}