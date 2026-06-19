import { useState } from 'react'
import ViewSwitcher from './ViewSwitcher.jsx'
import MiniNavigator from './MiniNavigator.jsx'
import styles from './Panel.module.css'

export default function Panel({ view, onViewChange, current, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const contents = (
    <div className={styles.contents}>
      <MiniNavigator current={current} onChange={onNavigate} />
      <div className={styles.divider} />
      <ViewSwitcher view={view} onChange={onViewChange} />
    </div>
  )

  return (
    <>
      {/* Desktop panel */}
      <aside className={styles.panel}>
        {contents}
      </aside>

      {/* Mobile drawer */}
      <div className={styles.mobileDrawer}>
        <button
          className={styles.drawerHandle}
          onClick={() => setDrawerOpen(prev => !prev)}
          aria-label="Toggle panel"
        >
          <span className={styles.handleBar} />
        </button>
        <div className={`${styles.drawerContents} ${drawerOpen ? styles.open : ''}`}>
          {contents}
        </div>
      </div>
    </>
  )
}