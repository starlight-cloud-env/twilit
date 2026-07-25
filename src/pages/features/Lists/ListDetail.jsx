import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Check, X, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import styles from './ListDetail.module.css'

const CATEGORY_OPTIONS = ['General', 'Grocery', 'Packing', 'To-Do']

export default function ListDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [editing, setEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [categoryDraft, setCategoryDraft] = useState('General')
  const [saving, setSaving] = useState(false)

  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchList()
  }, [id])

  const fetchList = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setList(data)
      setNameDraft(data.name)
      setCategoryDraft(data.category)
    }
    setLoading(false)
  }

  const isOwner = list && user && list.owner_id === user.id

  const startEditing = () => {
    setNameDraft(list.name)
    setCategoryDraft(list.category)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!nameDraft.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('lists')
      .update({ name: nameDraft.trim(), category: categoryDraft })
      .eq('id', id)
      .select()
      .maybeSingle()

    if (!error && data) {
      setList(data)
      setEditing(false)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('lists').delete().eq('id', id)
    if (!error) {
      navigate('/lists')
    } else {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Loading list...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>List not found, or you don't have access to it.</p>
        <Link to="/lists" className={styles.backLink}><ArrowLeft size={16} /> Back to Lists</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <Link to="/lists" className={styles.backLink}><ArrowLeft size={16} /> Back to Lists</Link>

      <div className={styles.header}>
        {editing ? (
          <div className={styles.editRow}>
            <input
              className={styles.nameInput}
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              autoFocus
            />
            <select
              className={styles.categorySelect}
              value={categoryDraft}
              onChange={e => setCategoryDraft(e.target.value)}
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className={styles.iconButton} onClick={handleSave} disabled={saving} title="Save">
              <Check size={18} />
            </button>
            <button className={styles.iconButton} onClick={() => setEditing(false)} title="Cancel">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div>
              <span className={styles.category}>{list.category}</span>
              <h1 className={styles.name}>{list.name}</h1>
            </div>
            {isOwner && (
              <div className={styles.headerActions}>
                <button className={styles.iconButton} onClick={startEditing} title="Rename list">
                  <Pencil size={16} />
                </button>
                {confirming ? (
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>Delete this list?</span>
                    <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
                      {deleting ? 'Deleting...' : 'Yes, delete'}
                    </button>
                    <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className={styles.iconButton} onClick={() => setConfirming(true)} title="Delete list">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.itemsPlaceholder}>
        <p className={styles.stateText}>
          Items are coming in the next phase — for now, this list exists and can be renamed or shared.
        </p>
      </div>

    </div>
  )
}