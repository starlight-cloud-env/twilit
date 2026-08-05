import { useState } from 'react'
import { X, Mail, Trash2, Clock, CheckCircle2 } from 'lucide-react'
import { useListMembers } from '../../../../hooks/useListMembers.js'
import styles from './ShareModal.module.css'

export default function ShareModal({ listId, onClose }) {
  const { members, loading, inviteMember, removeMember } = useListMembers(listId)
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState(null)

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!email.trim() || inviting) return

    setInviting(true)
    setError(null)
    const { error } = await inviteMember(email)

    if (error) {
      setError(error.message)
    } else {
      setEmail('')
    }
    setInviting(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>Share List</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          <form className={styles.inviteForm} onSubmit={handleInvite}>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                className={styles.input}
                type="email"
                placeholder="Invite by email..."
                value={email}
                onChange={e => { setError(null); setEmail(e.target.value) }}
              />
            </div>
            <button
              type="submit"
              className={styles.inviteButton}
              disabled={!email.trim() || inviting}
            >
              {inviting ? 'Inviting...' : 'Invite'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.membersSection}>
            <h3 className={styles.membersTitle}>People with access</h3>

            {loading ? (
              <p className={styles.stateText}>Loading...</p>
            ) : members.length === 0 ? (
              <p className={styles.stateText}>Nobody's been invited yet.</p>
            ) : (
              <div className={styles.membersList}>
                {members.map(member => (
                  <div key={member.id} className={styles.memberRow}>
                    <span className={styles.memberEmail}>{member.invited_email}</span>
                    <span className={`${styles.statusBadge} ${member.status === 'accepted' ? styles.accepted : styles.pending}`}>
                      {member.status === 'accepted'
                        ? <><CheckCircle2 size={12} /> Accepted</>
                        : <><Clock size={12} /> Pending</>
                      }
                    </span>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeMember(member.id)}
                      aria-label="Remove access"
                      title="Remove access"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}