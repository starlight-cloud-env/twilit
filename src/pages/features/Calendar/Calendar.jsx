import { useState } from 'react'
import Panel from './components/Panel.jsx'
import MonthView from './components/MonthView.jsx'
import WeekView from './components/WeekView.jsx'
import EventModal from './components/EventModal.jsx'
import { useEvents } from '../../../hooks/useEvents.js'
import styles from './Calendar.module.css'

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function Calendar() {
  const [view, setView] = useState('month')
  const [current, setCurrent] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const { createEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents()

  const handlePrev = () => {
    if (view === 'month') {
      setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
    } else {
      const d = new Date(current)
      d.setDate(d.getDate() - 7)
      setCurrent(d)
    }
  }

  const handleNext = () => {
    if (view === 'month') {
      setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
    } else {
      const d = new Date(current)
      d.setDate(d.getDate() + 7)
      setCurrent(d)
    }
  }

  const handleToday = () => setCurrent(new Date())
  const handleJump = (date) => setCurrent(date)

  return (
    <div className={styles.page}>

      <Panel
        view={view}
        onViewChange={setView}
        onJump={handleJump}
      />

      <div className={styles.canvas}>

        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button className={styles.todayButton} onClick={handleToday}>
              Today
            </button>
            <div className={styles.navButtons}>
              <button className={styles.navButton} onClick={handlePrev}>‹</button>
              <button className={styles.navButton} onClick={handleNext}>›</button>
            </div>
            <button
              className={styles.newEventButton}
              onClick={() => setShowEventModal(true)}
            >
              + New Event
            </button>
          </div>
        </div>

        <div className={styles.view}>
          {view === 'month'
            ? <MonthView
                current={current}
                getEventsForDate={getEventsForDate}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
              />
            : <WeekView
                current={current}
                getEventsForDate={getEventsForDate}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
              />
          }
        </div>

      </div>

      {showEventModal && (
        <EventModal
          onClose={() => setShowEventModal(false)}
          onCreate={createEvent}
          initialDate={toDateStr(new Date())}
        />
      )}

    </div>
  )
}