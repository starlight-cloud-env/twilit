import { useState } from 'react'
import EventDetailModal from './EventDetailModal.jsx'
import styles from './MonthView.module.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MonthView({ current, getEventsForDate, onUpdate, onDelete }) {
  const [selectedEvent, setSelectedEvent] = useState(null)

  const year = current.getFullYear()
  const month = current.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }

  const isToday = (d, isCurrent) =>
    isCurrent &&
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  const toDateStr = (d, isCurrent) => {
    const m = isCurrent ? month : (d < 15 ? month + 1 : month - 1)
    const y = year
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  return (
    <div className={styles.monthView}>

      <div className={styles.heading}>
        <h2 className={styles.title}>
          {MONTHS[month]} <span className={styles.year}>{year}</span>
        </h2>
      </div>

      <div className={styles.dayLabels}>
        {DAYS.map(d => (
          <span key={d} className={styles.dayLabel}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((cell, i) => {
          const dateStr = toDateStr(cell.day, cell.current)
          const dayEvents = cell.current ? (getEventsForDate?.(dateStr) || []) : []

          return (
            <div
              key={i}
              className={`
                ${styles.cell}
                ${!cell.current ? styles.faded : ''}
                ${isToday(cell.day, cell.current) ? styles.today : ''}
              `}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {dayEvents.length > 0 && (
                <div className={styles.eventList}>
                  {dayEvents.map(event => (
                    <button
                      key={event.id}
                      className={styles.eventPill}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}

    </div>
  )
}