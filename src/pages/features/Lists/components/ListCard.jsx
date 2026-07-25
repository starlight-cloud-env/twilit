import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Trash2 } from 'lucide-react'
import styles from './ListCard.module.css'

export default function ListCard({ list, isOwner, onDelete }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete()
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/lists/${list.id}`)}>

      <div className={styles.header}>
        <span className={styles.category}>{list.category}</span>
        {isOwner && (
          <span className={styles.ownerBadge} title="You own this list">
            <Crown size={13} />
          </span>
        )}
      </div>

      <h3 className={styles.name}>{list.name}</h3>

      {isOwner && (
        confirming ? (
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
            aria-label="Delete list"
            title="Delete list"
          >
            <Trash2 size={14} />
          </button>
        )
      )}

    </div>
  )
}