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
        <p className={styles.tagline}>Replace this with a one-line tagline for the project.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What is this?</h2>
        <PlaceholderNote>
          Write a short intro here — what Twilit is, who it's for, and why you built it.
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Design & Engineering Notes</h2>
        <PlaceholderNote>
          A good spot for a few standout decisions or lessons learned — e.g. how sharing/permissions
          were modeled, working through Row-Level Security edge cases, building the theme system,
          or designing the Nebula game engine from scratch.
        </PlaceholderNote>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What's Next</h2>
        <PlaceholderNote>
          Roadmap items, or things you'd improve with more time — shows you think past "done."
        </PlaceholderNote>
      </section>

      <footer className={styles.footer}>
        <PlaceholderNote>
          Add links here — GitHub repo, LinkedIn, resume, whatever's relevant.
        </PlaceholderNote>
      </footer>

    </div>
  )
}