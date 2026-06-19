import { useState } from 'react'
import ViewSwitcher from './ViewSwitcher.jsx'
import styles from './Panel.module.css'

export default function Panel({ view, onViewChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const contents = (
    <div className={styles.contents}>
      <p className={styles.sectionLabel}>View</p>
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
          <span className={styles.drawerIcon}>
            {drawerOpen ? '⌄' : '⌃'}
          </span>
          <span className={styles.drawerLabel}>
            {drawerOpen ? 'Close' : 'Options'}
          </span>
        </button>
        <div className={`${styles.drawerContents} ${drawerOpen ? styles.open : ''}`}>
          {contents}
        </div>
      </div>
    </>
  )
}