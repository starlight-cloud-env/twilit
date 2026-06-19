import styles from './MonthView.module.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MonthView({ current }) {
  const year = current.getFullYear()
  const month = current.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }

  // Next month leading days
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }

  const isToday = (d, isCurrent) =>
    isCurrent &&
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  return (
    <div className={styles.monthView}>

      {/* Month heading */}
      <div className={styles.heading}>
        <h2 className={styles.title}>
          {MONTHS[month]} <span className={styles.year}>{year}</span>
        </h2>
      </div>

      {/* Day labels */}
      <div className={styles.dayLabels}>
        {DAYS.map(d => (
          <span key={d} className={styles.dayLabel}>{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`
              ${styles.cell}
              ${!cell.current ? styles.faded : ''}
              ${isToday(cell.day, cell.current) ? styles.today : ''}
            `}
          >
            <span className={styles.dayNumber}>{cell.day}</span>
          </div>
        ))}
      </div>

    </div>
  )
}