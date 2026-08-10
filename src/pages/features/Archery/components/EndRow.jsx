import { useState, useEffect } from 'react'
import { countNinesAndTens } from '../scoring.js'
import styles from './EndRow.module.css'

export default function EndRow({ end, arrowCount, onUpdateArrows }) {
  const buildValues = () =>
    Array.from({ length: arrowCount }, (_, i) =>
      end.arrows[i] !== undefined ? String(end.arrows[i]) : ''
    )

  const [values, setValues] = useState(buildValues)

  useEffect(() => {
    setValues(buildValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end.arrows, arrowCount])

  const handleChange = (index, raw) => {
    const next = [...values]
    next[index] = raw
    setValues(next)
  }

  const clampScore = (raw) => {
    const n = parseInt(raw, 10)
    if (!Number.isFinite(n)) return null
    return Math.max(0, Math.min(10, n))
  }

  const commit = () => {
    const arrows = values
      .map(clampScore)
      .filter(n => n !== null)
    onUpdateArrows(end.id, arrows)
  }

  const total = values.reduce((sum, v) => {
    const n = clampScore(v)
    return sum + (n ?? 0)
  }, 0)

  const scores = values.map(clampScore).filter(n => n !== null)
  const { nines, tens } = countNinesAndTens(scores)

  return (
    <div className={styles.row}>
      <span className={styles.endLabel}>End {end.end_number}</span>

      <div className={styles.arrowInputs}>
        {values.map((v, i) => (
          <input
            key={i}
            className={styles.arrowInput}
            type="number"
            min="0"
            max="10"
            inputMode="numeric"
            value={v}
            onChange={e => handleChange(i, e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          />
        ))}
      </div>

      <span className={styles.endTotal}>{total}</span>
      <span className={styles.ninesTens} title="9s / 10s this end">{nines}/{tens}</span>
    </div>
  )
}