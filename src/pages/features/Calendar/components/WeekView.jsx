import styles from './WeekView.module.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function WeekView({ current }) {
  const today = new Date()

  // Get the Sunday of the current week
  const startOfWeek = new Date(current)
  startOfWeek.setDate(current.getDate() - current.getDay())

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const isToday = (date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const weekStart = days[0]
  const weekEnd = days[6]
  const spansTwoMonths = weekStart.getMonth() !== weekEnd.getMonth()

  const headingLabel = spansTwoMonths
    ? `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()} – ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`
    : `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`

  return (
    <div className={styles.weekView}>

      {/* Heading */}
      <div className={styles.heading}>
        <h2 className={styles.title}>{headingLabel}</h2>
      </div>

      {/* Day columns */}
      <div className={styles.grid}>
        {days.map((date, i) => (
          <div
            key={i}
            className={`${styles.column} ${isToday(date) ? styles.today : ''}`}
          >
            <div className={styles.columnHeader}>
              <span className={styles.dayName}>{DAYS[i]}</span>
              <span className={`${styles.dayNumber} ${isToday(date) ? styles.todayNumber : ''}`}>
                {date.getDate()}
              </span>
            </div>
            <div className={styles.columnBody} />
          </div>
        ))}
      </div>

    </div>
  )
}