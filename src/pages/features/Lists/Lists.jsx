import { useState } from 'react'
import { ListChecks, Plus, Mail } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useLists } from '../../../hooks/useLists.js'
import { usePendingInvites } from '../../../hooks/usePendingInvites.js'
import ListCard from './components/ListCard.jsx'
import NewListModal from './components/NewListModal.jsx'
import PendingInviteCard from './components/PendingInviteCard.jsx'
import styles from './Lists.module.css'

export default function Lists() {
  const { user } = useAuth()
  const { lists, loading, createList, deleteList, fetchLists } = useLists()
  const { invites, acceptInvite, declineInvite } = usePendingInvites()
  const [showNewListModal, setShowNewListModal] = useState(false)

  const handleAccept = async (inviteId) => {
    const { error } = await acceptInvite(inviteId)
    if (!error) fetchLists()
  }

  return (
    <div className={styles.page}>

      {invites.length > 0 && (
        <section className={styles.invitesSection}>
          <h2 className={styles.invitesTitle}>
            <Mail size={16} /> Pending Invites
          </h2>
          <div className={styles.invitesList}>
            {invites.map(invite => (
              <PendingInviteCard
                key={invite.id}
                invite={invite}
                onAccept={handleAccept}
                onDecline={declineInvite}
              />
            ))}
          </div>
        </section>
      )}

      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>Lists</h1>
        <button className={styles.newListButton} onClick={() => setShowNewListModal(true)}>
          <Plus size={16} /> New List
        </button>
      </div>

      {loading ? (
        <p className={styles.stateText}>Loading your lists...</p>
      ) : lists.length === 0 ? (
        <div className={styles.emptyState}>
          <ListChecks size={40} strokeWidth={1.5} />
          <p className={styles.stateText}>You don't have any lists yet.</p>
          <button className={styles.newListButton} onClick={() => setShowNewListModal(true)}>
            <Plus size={16} /> Create your first list
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {lists.map(list => (
            <ListCard
              key={list.id}
              list={list}
              isOwner={list.owner_id === user.id}
              onDelete={() => deleteList(list.id)}
            />
          ))}
        </div>
      )}

      {showNewListModal && (
        <NewListModal
          onClose={() => setShowNewListModal(false)}
          onCreate={createList}
        />
      )}

    </div>
  )
}