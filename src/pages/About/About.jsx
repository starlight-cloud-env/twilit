import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import styles from './About.module.css'

const TECH_STACK = [
  'React', 'Vite', 'Supabase', 'PostgreSQL', 'Vercel', 'GitHub', 'Lucide Icons'
]

function PlaceholderNote({ children }) {
  return (
    <div className={styles.placeholder}>
      <Pencil size={13} />
      <span>{children}</span>
    </div>
  )
}

export default function About() {
  return (
    <div className={styles.page}>

      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Twilit
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>About Twilit</h1>
        <p className={styles.tagline}>"Brendan-Built" tools and games, all under one sky.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What is this?</h2>
        <PlaceholderNote>
          Welcome to Twilit, this site serves as both a demonstration of what I can build and design, as well as serve a practical purpose for friends and family.
          Here, I plan on adding requested-of-me services so that there is a dedicated platform to host and display my work, as well as bring some form of joy to them.
        </PlaceholderNote>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tech Stack</h2>
        <div className={styles.stackGrid}>
          {TECH_STACK.map(tech => (
            <span key={tech} className={styles.stackBadge}>{tech}</span>
          ))}
        </div>
      </section>

      {/* 
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Design & Engineering Notes</h2>
        <PlaceholderNote>
          
        </PlaceholderNote>
      </section>
      */}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What's Next</h2>
        <PlaceholderNote>
          Roadmap:
          <ul>
            <li>» Powerful Notes</li>
            <li>» Pinball game</li>
            <li>» Location Finder</li>
          </ul>
        </PlaceholderNote>
      </section>

      <footer className={styles.footer}>
        <PlaceholderNote>
          Add links here
        </PlaceholderNote>
      </footer>

    </div>
  )
}