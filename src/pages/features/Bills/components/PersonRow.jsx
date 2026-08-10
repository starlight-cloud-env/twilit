import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import styles from './PersonRow.module.css'
import { calculatePersonTotal } from '../calculations.js'

export default function PersonRow({ person, taxMultiplier, onUpdateSubtotal, onDelete }) {
  const [draft, setDraft] = useState(String(person.subtotal))

  useEffect(() => {
    setDraft(String(person.subtotal))
  }, [person.subtotal])

  const commit = () => {
    const value = parseFloat(draft)
    const safeValue = Number.isFinite(value) && value >= 0 ? value : 0
    setDraft(String(safeValue))
    if (safeValue !== person.subtotal) {
      onUpdateSubtotal(person.id, safeValue)
    }
  }

  const total = calculatePersonTotal(person.subtotal, taxMultiplier)

  return (
    <div className={styles.row}>
      <span className={styles.name}>{person.name}</span>

      <div className={styles.inputWrap}>
        <span className={styles.dollarSign}>$</span>
        <input
          className={styles.input}
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === 'Enter' && e.target.blur()}
        />
      </div>

      <span className={styles.total}>${total.toFixed(2)}</span>

      <button
        className={styles.deleteButton}
        onClick={() => onDelete(person.id)}
        aria-label="Remove person"
        title="Remove person"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}