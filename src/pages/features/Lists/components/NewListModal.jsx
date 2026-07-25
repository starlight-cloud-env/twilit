import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './NewListModal.module.css'

const CATEGORY_OPTIONS = ['General', 'Grocery', 'Packing', 'To-Do']

export default function NewListModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('General')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a list name')
      return
    }

    setSaving(true)
    const { error } = await onCreate({ name: name.trim(), category })
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>New List</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          <div className={styles.field}>
            <label className={styles.label}>Name <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Beach Trip Packing"
              value={name}
              onChange={e => { setError(null); setName(e.target.value) }}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.input}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create List'}
          </button>
        </div>

      </div>
    </div>
  )
}