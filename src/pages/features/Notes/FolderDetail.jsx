import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, FileText } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import { useNotes } from '../../../hooks/useNotes.js'
import NoteRow from './components/NoteRow.jsx'
import styles from './FolderDetail.module.css'

export default function FolderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [folder, setFolder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [creating, setCreating] = useState(false)

  const { notes, loading: notesLoading, createNote, deleteNote } = useNotes(id)

  useEffect(() => {
    fetchFolder()
  }, [id])

  const fetchFolder = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes_folders')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setFolder(data)
    }
    setLoading(false)
  }

  const handleNewNote = async () => {
    setCreating(true)
    const { id: noteId, error } = await createNote()
    setCreating(false)
    if (!error && noteId) {
      navigate(`/notes/${id}/${noteId}`)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Loading folder...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Folder not found.</p>
        <Link to="/notes" className={styles.backLink}><ArrowLeft size={16} /> Back to Notes</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <Link to="/notes" className={styles.backLink}><ArrowLeft size={16} /> Back to Notes</Link>

      <div className={styles.header}>
        <h1 className={styles.name}>{folder.name}</h1>
        <button className={styles.newButton} onClick={handleNewNote} disabled={creating}>
          <Plus size={16} /> New Note
        </button>
      </div>

      {notesLoading ? (
        <p className={styles.stateText}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText size={36} strokeWidth={1.5} />
          <p className={styles.stateText}>No notes in this folder yet.</p>
        </div>
      ) : (
        <div className={styles.notesList}>
          {notes.map(note => (
            <NoteRow
              key={note.id}
              note={note}
              folderId={id}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      )}

    </div>
  )
}