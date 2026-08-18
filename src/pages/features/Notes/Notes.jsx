import { useState } from 'react'
import { Book, Plus } from 'lucide-react'
import { useNotesFolders } from '../../../hooks/useNotesFolders.js'
import FolderCard from './components/FolderCard.jsx'
import NewFolderModal from './components/NewFolderModal.jsx'
import styles from './Notes.module.css'

export default function Notes() {
  const { folders, loading, createFolder, deleteFolder } = useNotesFolders()
  const [showNewModal, setShowNewModal] = useState(false)

  return (
    <div className={styles.page}>

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