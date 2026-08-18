import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pin, FolderInput } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import RichTextEditor from './components/RichTextEditor.jsx'
import styles from './NoteEditor.module.css'

export default function NoteEditor() {
  const { folderId, noteId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState('')
  const [initialContent, setInitialContent] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [folders, setFolders] = useState([])
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    fetchNote()
    fetchFolders()
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
      setInitialContent(data.content)
      setIsPinned(data.is_pinned)
    }
    setLoading(false)
  }

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('notes_folders')
      .select('id, name')
      .order('name', { ascending: true })

    if (!error && data) setFolders(data)
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

  const handleContentChange = (html) => {
    scheduleSave({ content: html })
  }

  const togglePin = async () => {
    const next = !isPinned
    setIsPinned(next)
    const { error } = await supabase
      .from('notes')
      .update({ is_pinned: next })
      .eq('id', noteId)

    if (error) {
      console.error('Failed to update pin:', error)
      setIsPinned(!next)
    }
  }

  const handleMoveTo = async (targetFolderId) => {
    setShowMoveMenu(false)
    if (targetFolderId === folderId) return

    const { error } = await supabase
      .from('notes')
      .update({ folder_id: targetFolderId })
      .eq('id', noteId)

    if (!error) {
      navigate(`/notes/${targetFolderId}/${noteId}`)
    } else {
      console.error('Failed to move note:', error)
    }
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

      <div className={styles.topRow}>
        <Link to={`/notes/${folderId}`} className={styles.backLink}><ArrowLeft size={16} /> Back to Folder</Link>

        <div className={styles.actions}>
          <button
            className={`${styles.iconButton} ${isPinned ? styles.pinned : ''}`}
            onClick={togglePin}
            title={isPinned ? 'Unpin note' : 'Pin note'}
          >
            {isPinned ? <Pin size={16} fill="currentColor" /> : <Pin size={16} />}
          </button>

          <div className={styles.moveWrap}>
            <button
              className={styles.iconButton}
              onClick={() => setShowMoveMenu(prev => !prev)}
              title="Move to folder"
            >
              <FolderInput size={16} />
            </button>
            {showMoveMenu && (
              <div className={styles.moveMenu}>
                {folders.map(f => (
                  <button
                    key={f.id}
                    className={`${styles.moveOption} ${f.id === folderId ? styles.moveOptionCurrent : ''}`}
                    onClick={() => handleMoveTo(f.id)}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        className={styles.titleInput}
        value={title}
        onChange={e => handleTitleChange(e.target.value)}
        placeholder="Untitled"
      />

      <RichTextEditor
        initialContent={initialContent}
        onChange={handleContentChange}
      />

      <p className={styles.hint}>Autosaves as you type.</p>

    </div>
  )
}