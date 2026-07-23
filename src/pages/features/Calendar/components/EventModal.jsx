import { useState, useEffect } from 'react'
import styles from './EventModal.module.css'
import { X } from 'lucide-react'

const REPEAT_OPTIONS = [
  { value: 'none', label: 'Do Not Repeat' },
  { value: 'daily', label: 'Repeat Daily' },
  { value: 'weekly', label: 'Repeat Weekly' },
  { value: 'count', label: 'Repeat N+ Times' },
]

const empty = {
  title: '',
  details: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  repeat: 'none',
  repeat_count: '',
}

export default function EventModal({ onClose, onCreate, initialDate }) {
  const [form, setForm] = useState({ ...empty })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialDate) {
      setForm(prev => ({ ...prev, start_date: initialDate }))
    }
  }, [initialDate])

  const set = (field, value) => {
    setError(null)
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!form.title.trim()) return 'Please enter a title'
    if (!form.start_date) return 'Please enter a start date'
    if (form.end_date && form.end_date < form.start_date) return 'End date cannot be before start date'
    if (form.start_time && form.end_time && form.end_time < form.start_time && form.start_date === form.end_date) return 'End time cannot be before start time'
    if (form.repeat === 'count' && (!form.repeat_count || form.repeat_count < 1)) return 'Please enter a repeat count'
    return null
  }

  function formatTime(t) {
    if (!t) return null
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setError(err); return }

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      details: form.details.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      repeat: form.repeat === 'none' ? null : form.repeat,
      repeat_count: form.repeat === 'count' ? Number(form.repeat_count) : null,
    }

    const { error } = await onCreate(payload)
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    onClose()
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>New Event</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="Event title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          {/* Details */}
          <div className={styles.field}>
            <label className={styles.label}>Details</label>
            <textarea
              className={styles.textarea}
              placeholder="Optional description"
              value={form.details}
              onChange={e => set('details', e.target.value)}
              rows={3}
            />
          </div>

          {/* Date range */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date <span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                type="date"
                value={form.start_date}
                onChange={e => set('start_date', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Date</label>
              <input
                className={styles.input}
                type="date"
                value={form.end_date}
                onChange={e => set('end_date', e.target.value)}
              />
            </div>
          </div>

          {/* Time range */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Start Time</label>
              <input
                className={styles.input}
                type="time"
                value={form.start_time}
                onChange={e => set('start_time', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Time</label>
              <input
                className={styles.input}
                type="time"
                value={form.end_time}
                onChange={e => set('end_time', e.target.value)}
              />
            </div>
          </div>

          {/* Repeat */}
          <div className={styles.field}>
            <label className={styles.label}>Repeat</label>
            <select
              className={styles.input}
              value={form.repeat}
              onChange={e => set('repeat', e.target.value)}
            >
              {REPEAT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Repeat count */}
          {form.repeat === 'count' && (
            <div className={styles.field}>
              <label className={styles.label}>Number of Times</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={form.repeat_count}
                onChange={e => set('repeat_count', e.target.value)}
              />
            </div>
          )}

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
            {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>

      </div>
    </div>
  )
}