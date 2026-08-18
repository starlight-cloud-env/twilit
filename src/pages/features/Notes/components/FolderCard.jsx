import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Folder } from 'lucide-react'
import styles from './FolderCard.module.css'

export default function FolderCard({ folder, onDelete }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const noteCount = folder.notes?.[0]?.count ?? 0

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete()
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/notes/${folder.id}`)}>

      <div className={styles.iconWrap}>
        <Folder size={22} />
      </div>

      <h3 className={styles.name}>{folder.name}</h3>
      <span className={styles.count}>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</span>

      {confirming ? (
        <div className={styles.confirmRow} onClick={e => e.stopPropagation()}>
          <span className={styles.confirmText}>Delete folder & its notes?</span>
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
          aria-label="Delete folder"
          title="Delete folder"
        >
          <Trash2 size={14} />
        </button>
      )}

    </div>
  )
}