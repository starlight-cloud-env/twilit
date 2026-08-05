import { Check, Trash2 } from 'lucide-react'
import styles from './ListItemRow.module.css'

export default function ListItemRow({ item, onToggle, onDelete }) {
  return (
    <div className={styles.row}>
      <button
        className={`${styles.checkbox} ${item.is_checked ? styles.checked : ''}`}
        onClick={() => onToggle(item.id, !item.is_checked)}
        aria-label={item.is_checked ? 'Mark as not done' : 'Mark as done'}
      >
        {item.is_checked && <Check size={13} strokeWidth={3} />}
      </button>

      <span className={`${styles.content} ${item.is_checked ? styles.done : ''}`}>
        {item.content}
      </span>

      <button
        className={styles.deleteButton}
        onClick={() => onDelete(item.id)}
        aria-label="Delete item"
        title="Delete item"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}