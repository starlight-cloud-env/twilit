import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Users, Divide } from 'lucide-react'
import styles from './BillCard.module.css'

export default function BillCard({ bill, onDelete }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete()
  }

  const ModeIcon = bill.mode === 'itemized' ? Users : Divide

  return (
    <div className={styles.card} onClick={() => navigate(`/bills/${bill.id}`)}>

      <div className={styles.header}>
        <span className={styles.mode}>
          <ModeIcon size={12} />
          {bill.mode === 'itemized' ? 'Itemized' : 'Even Split'}
        </span>
      </div>

      <h3 className={styles.name}>{bill.name}</h3>

      {confirming ? (
        <div className={styles.confirmRow} onClick={e => e.stopPropagation()}>
          <span className={styles.confirmText}>Delete?</span>
          <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : 'Yes'}
          </button>
          <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
            No
          </button>
        </div>
      ) : (
        <button
          className={styles.deleteButton}
          onClick={(e) => { e.stopPropagation(); setConfirming(true) }}
          aria-label="Delete bill"
          title="Delete bill"
        >
          <Trash2 size={14} />
        </button>
      )}

    </div>
  )
}