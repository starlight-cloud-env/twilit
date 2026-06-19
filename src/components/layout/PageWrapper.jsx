import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import styles from './PageWrapper.module.css'

export default function PageWrapper() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}