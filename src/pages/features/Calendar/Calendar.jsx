import { useState } from 'react'
import Panel from './components/Panel.jsx'
import MonthView from './components/MonthView.jsx'
import WeekView from './components/WeekView.jsx'
import styles from './Calendar.module.css'

export default function Calendar() {
  const [view, setView] = useState('month')
  const [current, setCurrent] = useState(new Date())

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

  return (
    <div className={styles.page}>

      {/* Left panel */}
      <Panel
        view={view}
        onViewChange={setView}
      />

      {/* Right canvas */}
      <div className={styles.canvas}>

        {/* Canvas toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button className={styles.todayButton} onClick={handleToday}>
              Today
            </button>
            <div className={styles.navButtons}>
              <button className={styles.navButton} onClick={handlePrev}>‹</button>
              <button className={styles.navButton} onClick={handleNext}>›</button>
            </div>
          </div>
        </div>

        {/* Calendar view */}
        <div className={styles.view}>
          {view === 'month'
            ? <MonthView current={current} />
            : <WeekView current={current} />
          }
        </div>

      </div>

    </div>
  )
}