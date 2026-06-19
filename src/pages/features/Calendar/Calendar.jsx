import { useState } from 'react'
import Panel from './components/Panel.jsx'
import MonthView from './components/MonthView.jsx'
import WeekView from './components/WeekView.jsx'
import styles from './Calendar.module.css'

export default function Calendar() {
  const [view, setView] = useState('month')
  const [current, setCurrent] = useState(new Date())

  return (
    <div className={styles.page}>

      {/* Left panel */}
      <Panel
        view={view}
        onViewChange={setView}
        current={current}
        onNavigate={setCurrent}
      />

      {/* Right canvas */}
      <div className={styles.canvas}>
        {view === 'month'
          ? <MonthView current={current} />
          : <WeekView current={current} />
        }
      </div>

    </div>
  )
}