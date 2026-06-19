import styles from './MiniNavigator.module.css'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MiniNavigator({ current, onChange }) {
  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => onChange(new Date(year, month - 1, 1))
  const nextMonth = () => onChange(new Date(year, month + 1, 1))

  const cells = []

  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  const isToday = (d) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  return (
    <div className={styles.navigator}>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.arrow} onClick={prevMonth}>‹</button>
        <span className={styles.label}>
          {MONTHS[month]} {year}
        </span>
        <button className={styles.arrow} onClick={nextMonth}>›</button>
      </div>

      {/* Day labels */}
      <div className={styles.grid}>
        {DAYS.map(d => (
          <span key={d} className={styles.dayLabel}>{d}</span>
        ))}

        {/* Date cells */}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`${styles.cell} ${d === null ? styles.empty : ''} ${d && isToday(d) ? styles.today : ''}`}
          >
            {d || ''}
          </span>
        ))}
      </div>

    </div>
  )
}