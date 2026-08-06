import { useEffect, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { useNebulaGame } from '../../../hooks/useNebulaGame.js'
import { usePuzzleScore } from '../../../hooks/usePuzzleScore.js'
import { tierVisual } from './tiers.js'
import Tile from './components/Tile.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import styles from './Nebula.module.css'

const KEY_DIRECTIONS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
  W: 'up', S: 'down', A: 'left', D: 'right',
}

const SWIPE_THRESHOLD = 30

export default function Nebula() {
  const { grid, score, status, highestTierIndex, handleMove, reset, continuePlaying } = useNebulaGame()
  const { personalBest, leaderboard, leaderboardLoading, fetchLeaderboard, submitScoreIfBetter } = usePuzzleScore()
  const touchStart = useRef(null)

  useEffect(() => {
    submitScoreIfBetter(score, tierVisual(highestTierIndex).label)
  }, [score])

  useEffect(() => {
    const onKeyDown = (e) => {
      const direction = KEY_DIRECTIONS[e.key]
      if (!direction) return
      e.preventDefault()
      handleMove(direction)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleMove])

  const onTouchStart = (e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return

    if (absDx > absDy) {
      handleMove(dx > 0 ? 'right' : 'left')
    } else {
      handleMove(dy > 0 ? 'down' : 'up')
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Nebula</h1>
          <p className={styles.subtitle}>Merge celestial bodies up to a Galaxy</p>
        </div>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>Score</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
      </div>

      <div
        className={styles.board}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className={styles.cell} />
        ))}

        {grid.map((row, r) =>
          row.map((tile, c) => tile && (
            <Tile key={tile.id} tile={tile} row={r} col={c} />
          ))
        )}

        {status === 'won' && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>You reached the Galaxy!</p>
            <p className={styles.overlaySubtitle}>Keep merging for a higher score, or start fresh.</p>
            <div className={styles.overlayActions}>
              <button className={styles.primaryButton} onClick={continuePlaying}>Keep Playing</button>
              <button className={styles.secondaryButton} onClick={reset}>New Game</button>
            </div>
          </div>
        )}

        {status === 'lost' && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>Game Over</p>
            <p className={styles.overlaySubtitle}>Final score: {score}</p>
            <div className={styles.overlayActions}>
              <button className={styles.primaryButton} onClick={reset}>Try Again</button>
            </div>
          </div>
        )}
      </div>

      <button className={styles.resetButton} onClick={reset}>
        <RotateCcw size={15} /> New Game
      </button>

      <p className={styles.hint}>Use arrow keys, WASD, or swipe to play</p>

      <Leaderboard
        leaderboard={leaderboard}
        loading={leaderboardLoading}
        personalBest={personalBest}
        fetchLeaderboard={fetchLeaderboard}
      />

    </div>
  )
}