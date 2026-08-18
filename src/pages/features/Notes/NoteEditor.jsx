import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import styles from './NoteEditor.module.css'

export default function NoteEditor() {
  const { folderId, noteId } = useParams()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const saveTimer = useRef(null)

  useEffect(() => {
    fetchNote()
    return () => clearTimeout(saveTimer.current)
  }, [noteId])

  const fetchNote = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setTitle(data.title)
      setContent(data.content)
    }
    setLoading(false)
  }

  const scheduleSave = (updates) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', noteId)

      if (error) console.error('Failed to save note:', error)
    }, 600)
  }

  const handleTitleChange = (value) => {
    setTitle(value)
    scheduleSave({ title: value })
  }

  const handleContentChange = (value) => {
    setContent(value)
    scheduleSave({ content: value })
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Loading note...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Note not found.</p>
        <Link to={`/notes/${folderId}`} className={styles.backLink}><ArrowLeft size={16} /> Back to Folder</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <Link to={`/notes/${folderId}`} className={styles.backLink}><ArrowLeft size={16} /> Back to Folder</Link>

      <input
        className={styles.titleInput}
        value={title}
        onChange={e => handleTitleChange(e.target.value)}
        placeholder="Untitled"
      />

      <textarea
        className={styles.contentArea}
        value={content}
        onChange={e => handleContentChange(e.target.value)}
        placeholder="Start writing..."
      />

      <p className={styles.hint}>Rich text formatting (bold, highlighting, colors) is coming in the next phase — plain text for now, and it autosaves as you type.</p>

    </div>
  )
}