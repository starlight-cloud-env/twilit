import styles from './Hero.module.css'

const HERO_CONTENT = {
  Utility: {
    title: 'Utility',
    description: 'Tools and services to help you stay organized and get things done.',
    emoji: '🛠️',
  }
}

export default function Hero({ category }) {
  const content = HERO_CONTENT[category] || {
    title: category,
    description: 'Explore our services.',
    emoji: '✨',
  }

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.emoji}>{content.emoji}</span>
        <div>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.description}>{content.description}</p>
        </div>
      </div>
    </div>
  )
}