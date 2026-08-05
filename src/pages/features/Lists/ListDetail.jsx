import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Check, X, Trash2, Plus, ListChecks, Users } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useListItems } from '../../../hooks/useListItems.js'
import ListItemRow from './components/ListItemRow.jsx'
import ShareModal from './components/ShareModal.jsx'
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
  const [showShareModal, setShowShareModal] = useState(false)

  const { items, loading: itemsLoading, addItem, toggleItem, deleteItem } = useListItems(id)
  const [newItemText, setNewItemText] = useState('')
  const [addingItem, setAddingItem] = useState(false)

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
    const updates = { name: nameDraft.trim(), category: categoryDraft }
    const { error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setList(prev => ({ ...prev, ...updates }))
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

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItemText.trim() || addingItem) return
    setAddingItem(true)
    const text = newItemText
    setNewItemText('')
    const { error } = await addItem(text)
    if (error) setNewItemText(text)
    setAddingItem(false)
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
                <button className={styles.iconButton} onClick={() => setShowShareModal(true)} title="Share list">
                  <Users size={16} />
                </button>
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

      <div className={styles.itemsSection}>

        <form className={styles.addItemForm} onSubmit={handleAddItem}>
          <input
            className={styles.addItemInput}
            type="text"
            placeholder="Add an item..."
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
          />
          <button
            type="submit"
            className={styles.addItemButton}
            disabled={!newItemText.trim() || addingItem}
            aria-label="Add item"
          >
            <Plus size={18} />
          </button>
        </form>

        {itemsLoading ? (
          <p className={styles.stateText}>Loading items...</p>
        ) : items.length === 0 ? (
          <div className={styles.itemsEmptyState}>
            <ListChecks size={32} strokeWidth={1.5} />
            <p className={styles.stateText}>No items yet — add your first one above.</p>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {[...items]
              .sort((a, b) => Number(a.is_checked) - Number(b.is_checked))
              .map(item => (
                <ListItemRow
                  key={item.id}
                  item={item}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                />
              ))}
          </div>
        )}

      </div>

      {showShareModal && (
        <ShareModal listId={id} onClose={() => setShowShareModal(false)} />
      )}

    </div>
  )
}