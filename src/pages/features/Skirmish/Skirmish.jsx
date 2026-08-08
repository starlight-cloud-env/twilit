import { useEffect } from 'react'
import { Heart, RotateCcw } from 'lucide-react'
import { useSkirmishGame } from '../../../hooks/useSkirmishGame.js'
import { useSkirmishScore } from '../../../hooks/useSkirmishScore.js'
import Leaderboard from './components/Leaderboard.jsx'
import styles from './Skirmish.module.css'

export default function Skirmish() {
  const { canvasRef, score, lives, wave, status, launch, reset, canvasWidth, canvasHeight } = useSkirmishGame()
  const { personalBest, leaderboard, leaderboardLoading, fetchLeaderboard, submitScoreIfBetter } = useSkirmishScore()

  // Debounced so a fast multi-kill streak doesn't fire overlapping network
  // requests that can resolve out of order and silently overwrite a
  // higher score with a stale lower one.
  useEffect(() => {
    const timer = setTimeout(() => {
      submitScoreIfBetter(score, wave)
    }, 600)
    return () => clearTimeout(timer)
  }, [score])

  // Guaranteed final write the instant the game actually ends — nothing
  // else can change score after this, so it can't race with anything.
  useEffect(() => {
    if (status === 'lost') {
      submitScoreIfBetter(score, wave)
    }
  }, [status])

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Skirmish</h1>
          <p className={styles.subtitle}>Wave {wave}</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.livesBox}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                size={16}
                fill={i < lives ? 'currentColor' : 'none'}
                className={i < lives ? styles.lifeFull : styles.lifeEmpty}
              />
            ))}
          </div>
          <div className={styles.scoreBox}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
        </div>
      </div>

      <div className={styles.boardWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
        />

        {status === 'ready' && (
          <div className={styles.overlay} onClick={launch}>
            <p className={styles.overlayTitle}>Skirmish</p>
            <p className={styles.overlaySubtitle}>Move the paddle, launch the ball, clear the formation.</p>
            <button className={styles.primaryButton} onClick={launch}>Tap or Press Space to Launch</button>
          </div>
        )}

        {status === 'wave-clear' && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>Wave {wave} Cleared!</p>
            <p className={styles.overlaySubtitle}>Next wave incoming...</p>
          </div>
        )}

        {status === 'lost' && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>Game Over</p>
            <p className={styles.overlaySubtitle}>Final score: {score} · Reached wave {wave}</p>
            <button className={styles.primaryButton} onClick={reset}>
              <RotateCcw size={15} /> Try Again
            </button>
          </div>
        )}
      </div>

      <p className={styles.hint}>Move the mouse, drag your finger, or use arrow keys — Space or tap to launch</p>

      <Leaderboard
        leaderboard={leaderboard}
        loading={leaderboardLoading}
        personalBest={personalBest}
        fetchLeaderboard={fetchLeaderboard}
      />

    </div>
  )
}0