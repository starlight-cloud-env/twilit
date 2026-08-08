import { useState } from 'react'
import { Target, Plus } from 'lucide-react'
import { useScorecards } from '../../../hooks/useScorecards.js'
import ScorecardCard from './components/ScorecardCard.jsx'
import NewScorecardModal from './components/NewScorecardModal.jsx'
import styles from './Archery.module.css'

export default function Archery() {
  const { scorecards, loading, createScorecard, deleteScorecard } = useScorecards()
  const [showNewModal, setShowNewModal] = useState(false)

  return (
    <div className={styles.page}>

      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>Archery</h1>
        <button className={styles.newButton} onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> New Scorecard
        </button>
      </div>

      {loading ? (
        <p className={styles.stateText}>Loading your scorecards...</p>
      ) : scorecards.length === 0 ? (
        <div className={styles.emptyState}>
          <Target size={40} strokeWidth={1.5} />
          <p className={styles.stateText}>No scorecards yet.</p>
          <button className={styles.newButton} onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> Create your first scorecard
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {scorecards.map(card => (
            <ScorecardCard
              key={card.id}
              scorecard={card}
              onDelete={() => deleteScorecard(card.id)}
            />
          ))}
        </div>
      )}

      {showNewModal && (
        <NewScorecardModal
          onClose={() => setShowNewModal(false)}
          onCreate={createScorecard}
        />
      )}

    </div>
  )
}