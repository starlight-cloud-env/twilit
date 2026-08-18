import { useState, useEffect } from 'react'
import { X, ListChecks } from 'lucide-react'
import { supabase } from '../../../../lib/supabase.js'
import styles from './ListEmbedPicker.module.css'

export default function ListEmbedPicker({ onClose, onSelect }) {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('lists')
      .select('id, name, category')
      .order('created_at', { ascending: false })

    if (!error && data) setLists(data)
    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>Embed a List</h2>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          {loading ? (
            <p className={styles.stateText}>Loading your lists...</p>
          ) : lists.length === 0 ? (
            <p className={styles.stateText}>You don't have any lists yet — create one from the Lists page first.</p>
          ) : (
            <div className={styles.listOptions}>
              {lists.map(list => (
                <button
                  key={list.id}
                  className={styles.listOption}
                  onClick={() => onSelect(list)}
                >
                  <ListChecks size={16} />
                  <span className={styles.listName}>{list.name}</span>
                  <span className={styles.listCategory}>{list.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}