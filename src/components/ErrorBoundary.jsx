import { Component } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In a real production app this is where an error-tracking service
    // (Sentry, etc.) would be wired in.
    console.error('Twilit caught a render error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return ( 
        <div className={styles.page}>
          <div className={styles.card}>
            <span className={styles.icon}>
              <AlertTriangle size={28} />
            </span>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.subtitle}>
              This part of Twilit hit an unexpected error. The rest of the site is unaffected —
              you can try again or head back home.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={this.handleReset}>
                <RotateCcw size={15} /> Try Again
              </button>
              <a className={styles.secondaryButton} href="/">
                <Home size={15} /> Back to Twilit
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}