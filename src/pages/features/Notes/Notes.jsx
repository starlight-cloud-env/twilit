import { useState } from 'react'
import { Book, Plus, Pin } from 'lucide-react'
import { useNotesFolders } from '../../../hooks/useNotesFolders.js'
import { usePinnedNotes } from '../../../hooks/usePinnedNotes.js'
import FolderCard from './components/FolderCard.jsx'
import NewFolderModal from './components/NewFolderModal.jsx'
import PinnedNoteRow from './components/PinnedNoteRow.jsx'
import styles from './Notes.module.css'

export default function Notes() {
  const { folders, loading, createFolder, deleteFolder } = useNotesFolders()
  const { pinnedNotes, loading: pinnedLoading } = usePinnedNotes()
  const [showNewModal, setShowNewModal] = useState(false)

  return (
    <div className={styles.page}>

      {!pinnedLoading && pinnedNotes.length > 0 && (
        <section className={styles.pinnedSection}>
          <h2 className={styles.sectionTitle}>
            <Pin size={16} fill="currentColor" /> Pinned
          </h2>
          <div className={styles.pinnedList}>
            {pinnedNotes.map(note => (
              <PinnedNoteRow key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>Notes</h1>
        <button className={styles.newButton} onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> New Folder
        </button>
      </div>

      {loading ? (
        <p className={styles.stateText}>Loading your folders...</p>
      ) : folders.length === 0 ? (
        <div className={styles.emptyState}>
          <Book size={40} strokeWidth={1.5} />
          <p className={styles.stateText}>No folders yet.</p>
          <button className={styles.newButton} onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> Create your first folder
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {folders.map(folder => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onDelete={() => deleteFolder(folder.id)}
            />
          ))}
        </div>
      )}

      {showNewModal && (
        <NewFolderModal
          onClose={() => setShowNewModal(false)}
          onCreate={createFolder}
        />
      )}

    </div>
  )
}