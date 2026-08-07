import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>Twilit</span>
      <Link to="/about" className={styles.link}>About This Project</Link>
    </footer>
  )
}