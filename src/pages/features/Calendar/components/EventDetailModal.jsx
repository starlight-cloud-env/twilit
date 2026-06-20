import { useState } from 'react'
import styles from './EventDetailModal.module.css'

const REPEAT_OPTIONS = [
  { value: 'none', label: 'Do Not Repeat' },
  { value: 'daily', label: 'Repeat Daily' },
  { value: 'weekly', label: 'Repeat Weekly' },
  { value: 'count', label: 'Repeat N+ Times' },
]

function formatTime(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDate(d) {
  if (!d) return null
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

export default function EventDetailModal({ event, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...event, repeat: event.repeat || 'none', repeat_count: event.repeat_count || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const set = (field, value) => {
    setError(null)
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      details: form.details?.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      repeat: form.repeat === 'none' ? null : form.repeat,
      repeat_count: form.repeat === 'count' ? Number(form.repeat_count) : null,
    }
    const { error } = await onUpdate(event.id, payload)
    if (error) { setError(error.message); setSaving(false); return }
    setEditing(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(event.id)
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
          <h2 className={styles.title}>
            {editing ? 'Edit Event' : event.title}
          </h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {editing ? (

            // Edit form
            <div className={styles.form}>

              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Details</label>
                <textarea
                  className={styles.textarea}
                  value={form.details || ''}
                  onChange={e => set('details', e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Start Date</label>
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
                    value={form.end_date || ''}
                    onChange={e => set('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Start Time</label>
                  <input
                    className={styles.input}
                    type="time"
                    value={form.start_time || ''}
                    onChange={e => set('start_time', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>End Time</label>
                  <input
                    className={styles.input}
                    type="time"
                    value={form.end_time || ''}
                    onChange={e => set('end_time', e.target.value)}
                  />
                </div>
              </div>

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

              {form.repeat === 'count' && (
                <div className={styles.field}>
                  <label className={styles.label}>Number of Times</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={form.repeat_count}
                    onChange={e => set('repeat_count', e.target.value)}
                  />
                </div>
              )}

              {error && <p className={styles.error}>{error}</p>}

            </div>

          ) : (

            // Detail view
            <div className={styles.details}>

              {event.details && (
                <div className={styles.detailBlock}>
                  <p className={styles.detailLabel}>Details</p>
                  <p className={styles.detailValue}>{event.details}</p>
                </div>
              )}

              <div className={styles.detailBlock}>
                <p className={styles.detailLabel}>Date</p>
                <p className={styles.detailValue}>
                  {formatDate(event.start_date)}
                  {event.end_date && event.end_date !== event.start_date
                    ? ` → ${formatDate(event.end_date)}`
                    : ''}
                </p>
              </div>

              {(event.start_time || event.end_time) && (
                <div className={styles.detailBlock}>
                  <p className={styles.detailLabel}>Time</p>
                  <p className={styles.detailValue}>
                    {formatTime(event.start_time)}
                    {event.end_time ? ` → ${formatTime(event.end_time)}` : ''}
                  </p>
                </div>
              )}

              {event.repeat && (
                <div className={styles.detailBlock}>
                  <p className={styles.detailLabel}>Repeat</p>
                  <p className={styles.detailValue}>
                    {REPEAT_OPTIONS.find(o => o.value === event.repeat)?.label || event.repeat}
                    {event.repeat_count ? ` × ${event.repeat_count}` : ''}
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

        <div className={styles.footer}>

          {/* Delete / confirm */}
          {!editing && (
            confirming ? (
              <div className={styles.confirmRow}>
                <span className={styles.confirmText}>Delete this event?</span>
                <button
                  className={styles.confirmYes}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button
                  className={styles.confirmNo}
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className={styles.deleteButton}
                onClick={() => setConfirming(true)}
              >
                Delete
              </button>
            )
          )}

          <div className={styles.footerRight}>
            {editing ? (
              <>
                <button
                  className={styles.cancelButton}
                  onClick={() => { setEditing(false); setError(null) }}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}