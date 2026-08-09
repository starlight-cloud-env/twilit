import styles from './RouteLoading.module.css'

export default function RouteLoading() {
  return (
    <div className={styles.wrap}>
      <span className={styles.pulse} />
    </div>
  )
}