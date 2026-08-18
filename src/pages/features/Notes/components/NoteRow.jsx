import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import styles from './NoteRow.module.css'

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function NoteRow({ note, folderId, onDelete }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete()
  }

  const preview = stripHtml(note.content || '').slice(0, 90)
  const date = new Date(note.updated_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric',
  })

  return (
    <div className={styles.row} onClick={() => navigate(`/notes/${folderId}/${note.id}`)}>

      <div className={styles.info}>
        <span className={styles.title}>{note.title || 'Untitled'}</span>
        {preview && <span className={styles.preview}>{preview}</span>}
      </div>

      <span className={styles.date}>{date}</span>

      {confirming ? (
        <div className={styles.confirmRow} onClick={e => e.stopPropagation()}>
          <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : 'Delete'}
          </button>
          <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          className={styles.deleteButton}
          onClick={(e) => { e.stopPropagation(); setConfirming(true) }}
          aria-label="Delete note"
          title="Delete note"
        >
          <Trash2 size={14} />
        </button>
      )}

    </div>
  )
}