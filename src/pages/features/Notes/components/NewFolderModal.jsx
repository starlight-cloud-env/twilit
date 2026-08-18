import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './NewFolderModal.module.css'

export default function NewFolderModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
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
      setError('Please enter a folder name')
      return
    }

    setSaving(true)
    const { error } = await onCreate(name.trim())

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
          <h2 className={styles.title}>New Folder</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Name <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Work, Recipes, Ideas"
              value={name}
              onChange={e => { setError(null); setName(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? 'Creating...' : 'Create Folder'}
          </button>
        </div>

      </div>
    </div>
  )
}