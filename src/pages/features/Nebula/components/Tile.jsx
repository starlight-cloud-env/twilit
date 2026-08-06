import { tierVisual } from '../tiers.js'
import styles from './Tile.module.css'

export default function Tile({ tile, row, col }) {
  const visual = tierVisual(tile.tier)

  return (
    <div
      className={[
        styles.tile,
        visual.glow ? styles.glow : '',
        tile.isNew ? styles.spawn : '',
        tile.justMerged ? styles.merged : '',
      ].join(' ').trim()}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        background: visual.bg,
        color: visual.text,
      }}
    >
      <span className={styles.label}>{visual.label}</span>
    </div>
  )
}