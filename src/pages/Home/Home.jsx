import { Calendar, ListChecks, Star, Gamepad2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBookmarks } from '../../hooks/useBookmarks.js'
import Hero from '../../components/layout/Hero.jsx'
import ServiceCard from '../../components/cards/ServiceCard.jsx'
import styles from './Home.module.css'

const SERVICES = [
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    category: 'Utility',
    path: '/calendar',
    protected: true,
  },
  {
    id: 'lists',
    name: 'Lists',
    icon: ListChecks,
    category: 'Utility',
    path: '/lists',
    protected: true,
  },
  {
    id: 'nebula',
    name: 'Nebula',
    icon: Gamepad2,
    category: 'Games',
    path: '/nebula',
    protected: false,
  }
]

export default function Home() {
  const { user } = useAuth()
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  const pinnedServices = SERVICES.filter(s => isBookmarked(s.id))

  const categories = [...new Set(SERVICES.map(s => s.category))]

  return (
    <div className={styles.page}>

      {/* Pinned Row */}
      {user && (
        <section className={styles.pinnedSection}>
          <h2 className={styles.sectionTitle}>
            <Star size={18} fill="currentColor" /> Pinned
          </h2>
          {pinnedServices.length === 0 ? (
            <p className={styles.emptyState}>
              Pin a service to see it here
            </p>
          ) : (
            <div className={styles.grid}>
              {pinnedServices.map(service => (
                <ServiceCard
                  key={`pinned-${service.id}`}
                  service={service}
                  isBookmarked={true}
                  onBookmark={() => removeBookmark(service.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Category Sections */}
      {categories.map(category => (
        <section key={category} className={styles.categorySection}>
          <Hero category={category} />
          <div className={styles.grid}>
            {SERVICES
              .filter(s => s.category === category)
              .map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isBookmarked={isBookmarked(service.id)}
                  onBookmark={() =>
                    isBookmarked(service.id)
                      ? removeBookmark(service.id)
                      : addBookmark(service.id)
                  }
                />
              ))}
          </div>
        </section>
      ))}

    </div>
  )
}