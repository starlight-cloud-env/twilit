import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import { useScorecardEnds } from '../../../hooks/useScorecardEnds.js'
import EndRow from './components/EndRow.jsx'
import { ARROWS_PER_END } from './constants.js'
import { countNinesAndTens } from './scoring.js'
import styles from './ScorecardDetail.module.css'

export default function ScorecardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [scorecard, setScorecard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const { ends, loading: endsLoading, updateEndArrows } = useScorecardEnds(id)

  useEffect(() => {
    fetchScorecard()
  }, [id])

  const fetchScorecard = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('archery_scorecards')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setScorecard(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('archery_scorecards').delete().eq('id', id)
    if (!error) {
      navigate('/archery')
    } else {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Loading scorecard...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Scorecard not found.</p>
        <Link to="/archery" className={styles.backLink}><ArrowLeft size={16} /> Back to Scorecards</Link>
      </div>
    )
  }

  const arrowCount = ARROWS_PER_END[scorecard.mode]
  const maxPossible = arrowCount * 10 * 10
  const totalArrows = arrowCount * 10
  const grandTotal = ends.reduce(
    (sum, end) => sum + end.arrows.reduce((s, a) => s + a, 0), 0
  )
  const arrowsShot = ends.reduce((count, end) => count + end.arrows.length, 0)
  const average = arrowsShot > 0 ? (grandTotal / arrowsShot).toFixed(2) : '0.00'
  const allScores = ends.flatMap(end => end.arrows)
  const { nines, tens } = countNinesAndTens(allScores)

  return (
    <div className={styles.page}>

      <Link to="/archery" className={styles.backLink}><ArrowLeft size={16} /> Back to Scorecards</Link>

      <div className={styles.header}>
        <div>
          <span className={styles.mode}>{scorecard.mode === 'indoor' ? 'Indoor' : 'Outdoor'}</span>
          <h1 className={styles.name}>{scorecard.name}</h1>
        </div>

        {confirming ? (
          <div className={styles.confirmRow}>
            <span className={styles.confirmText}>Delete this scorecard?</span>
            <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, delete'}
            </button>
            <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={styles.iconButton} onClick={() => setConfirming(true)} title="Delete scorecard">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className={styles.statsPanel}>
        <button
          className={styles.statsToggle}
          onClick={() => setStatsOpen(prev => !prev)}
          aria-expanded={statsOpen}
        >
          <span className={styles.statsToggleScore}>
            {grandTotal} <span className={styles.statMax}>/ {maxPossible}</span>
          </span>
          <span className={styles.statsToggleLabel}>
            {statsOpen ? 'Hide Stats' : 'Show Stats'}
            {statsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
        </button>

        {statsOpen && (
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Score</span>
              <span className={styles.statValue}>
                {grandTotal}<span className={styles.statMax}> / {maxPossible}</span>
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Arrows</span>
              <span className={styles.statValue}>
                {arrowsShot}<span className={styles.statMax}> / {totalArrows}</span>
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Average</span>
              <span className={styles.statValue}>{average}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>9s / 10s</span>
              <span className={styles.statValue}>{nines}/{tens}</span>
            </div>
          </div>
        )}
      </div>

      {endsLoading ? (
        <p className={styles.stateText}>Loading ends...</p>
      ) : (
        <div className={styles.endsList}>
          <div className={styles.endsHeader}>
            <span className={styles.endsHeaderLabel}>End</span>
            <span className={styles.endsHeaderArrows}>Arrows</span>
            <span className={styles.endsHeaderTotal}>Total</span>
            <span className={styles.endsHeaderNinesTens}>9s/10s</span>
          </div>
          {ends.map(end => (
            <EndRow
              key={end.id}
              end={end}
              arrowCount={arrowCount}
              onUpdateArrows={updateEndArrows}
            />
          ))}
        </div>
      )}

    </div>
  )
}