import { useState } from 'react'
import styles from './JumpToDate.module.css'

export default function JumpToDate({ view, onJump }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

  const handleInput = (e) => {
    setError(null)
    const raw = e.target.value.replace(/\D/g, '')
    let formatted = raw

    if (raw.length >= 3 && raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`
    } else if (raw.length >= 5) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`
    }

    setInput(formatted)
  }

  const handleJump = () => {
    setError(null)

    // Expect MM/dd/YYYY
    const parts = input.split('/')
    if (parts.length !== 3) {
      setError('Use MM/dd/YYYY format')
      return
    }

    const [mm, dd, yyyy] = parts.map(Number)

    if (
      isNaN(mm) || isNaN(dd) || isNaN(yyyy) ||
      mm < 1 || mm > 12 ||
      dd < 1 || dd > 31 ||
      yyyy < 1900 || yyyy > 2100
    ) {
      setError('Please enter a valid date')
      return
    }

    const date = new Date(yyyy, mm - 1, dd)

    if (
      date.getMonth() !== mm - 1 ||
      date.getDate() !== dd
    ) {
      setError('Date does not exist')
      return
    }

    onJump(date)
    setInput('')
  }

  return (
    <div className={styles.container}>
      <p className={styles.label}>Jump to Date</p>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder="MM/dd/YYYY"
          value={input}
          onChange={handleInput}
          maxLength={10}
          onKeyDown={e => e.key === 'Enter' && handleJump()}
        />
        <button className={styles.button} onClick={handleJump}>
          →
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}