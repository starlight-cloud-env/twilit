import { useState, useEffect } from 'react'
import { X, Users, Divide } from 'lucide-react'
import styles from './NewBillModal.module.css'

export default function NewBillModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [mode, setMode] = useState('itemized')
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
      setError('Please enter a bill name')
      return
    }

    setSaving(true)
    const { error } = await onCreate({
      name: name.trim(),
      mode,
      tax_rate: 0,
      even_split_total: mode === 'even_split' ? 0 : null,
      even_split_people_count: mode === 'even_split' ? 2 : null,
    })

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
          <h2 className={styles.title}>New Bill</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          <div className={styles.field}>
            <label className={styles.label}>Name <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Dinner at Olive Garden"
              value={name}
              onChange={e => { setError(null); setName(e.target.value) }}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mode</label>
            <div className={styles.modeOptions}>
              <button
                type="button"
                className={`${styles.modeOption} ${mode === 'itemized' ? styles.modeSelected : ''}`}
                onClick={() => setMode('itemized')}
              >
                <Users size={18} />
                <span className={styles.modeName}>Itemized</span>
                <span className={styles.modeDesc}>Track a running total per person</span>
              </button>
              <button
                type="button"
                className={`${styles.modeOption} ${mode === 'even_split' ? styles.modeSelected : ''}`}
                onClick={() => setMode('even_split')}
              >
                <Divide size={18} />
                <span className={styles.modeName}>Even Split</span>
                <span className={styles.modeDesc}>Enter a total, split evenly</span>
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
            {saving ? 'Creating...' : 'Create Bill'}
          </button>
        </div>

      </div>
    </div>
  )
}