import { Check, X } from 'lucide-react'
import styles from './PendingInviteCard.module.css'

export default function PendingInviteCard({ invite, onAccept, onDecline }) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.category}>{invite.lists?.category}</span>
        <span className={styles.name}>{invite.lists?.name}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.acceptButton} onClick={() => onAccept(invite.id)}>
          <Check size={14} /> Accept
        </button>
        <button className={styles.declineButton} onClick={() => onDecline(invite.id)}>
          <X size={14} /> Decline
        </button>
      </div>
    </div>
  )
}