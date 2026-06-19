import styles from './ViewSwitcher.module.css'

export default function ViewSwitcher({ view, onChange }) {
  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.button} ${view === 'month' ? styles.active : ''}`}
        onClick={() => onChange('month')}
      >
        Month
      </button>
      <button
        className={`${styles.button} ${view === 'week' ? styles.active : ''}`}
        onClick={() => onChange('week')}
      >
        Week
      </button>
    </div>
  )
}