import { useNavigate } from 'react-router-dom'
import { Pin } from 'lucide-react'
import styles from './PinnedNoteRow.module.css'

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function PinnedNoteRow({ note }) {
  const navigate = useNavigate()
  const preview = stripHtml(note.content || '').slice(0, 80)

  return (
    <div className={styles.row} onClick={() => navigate(`/notes/${note.folder_id}/${note.id}`)}>
      <Pin size={13} className={styles.pinIcon} fill="currentColor" />
      <div className={styles.info}>
        <span className={styles.title}>{note.title || 'Untitled'}</span>
        {preview && <span className={styles.preview}>{preview}</span>}
      </div>
      <span className={styles.folderName}>{note.notes_folders?.name}</span>
    </div>
  )
}