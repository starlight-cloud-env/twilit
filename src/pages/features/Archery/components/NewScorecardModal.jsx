import { useState, useEffect } from 'react'
import { X, Home, Sun } from 'lucide-react'
import styles from './NewScorecardModal.module.css'

export default function NewScorecardModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [mode, setMode] = useState('indoor')
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
      setError('Please enter a name')
      return
    }

    setSaving(true)
    const { error } = await onCreate({ name: name.trim(), mode })

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
          <h2 className={styles.title}>New Scorecard</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          <div className={styles.field}>
            <label className={styles.label}>Name <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Saturday Practice"
              value={name}
              onChange={e => { setError(null); setName(e.target.value) }}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Round Type</label>
            <div className={styles.modeOptions}>
              <button
                type="button"
                className={`${styles.modeOption} ${mode === 'indoor' ? styles.modeSelected : ''}`}
                onClick={() => setMode('indoor')}
              >
                <Home size={18} />
                <span className={styles.modeName}>Indoor</span>
                <span className={styles.modeDesc}>10 ends × 3 arrows</span>
              </button>
              <button
                type="button"
                className={`${styles.modeOption} ${mode === 'outdoor' ? styles.modeSelected : ''}`}
                onClick={() => setMode('outdoor')}
              >
                <Sun size={18} />
                <span className={styles.modeName}>Outdoor</span>
                <span className={styles.modeDesc}>10 ends × 6 arrows</span>
              </button>
            </div>
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
            {saving ? 'Creating...' : 'Create Scorecard'}
          </button>
        </div>

      </div>
    </div>
  )
}