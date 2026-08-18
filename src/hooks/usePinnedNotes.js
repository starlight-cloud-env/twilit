import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function usePinnedNotes() {
  const { user } = useAuth()
  const [pinnedNotes, setPinnedNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPinnedNotes([])
      setLoading(false)
      return
    }
    fetchPinnedNotes()
  }, [user])

  const fetchPinnedNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*, notes_folders(name)')
      .eq('is_pinned', true)
      .order('updated_at', { ascending: false })

    if (!error && data) setPinnedNotes(data)
    setLoading(false)
  }

  return { pinnedNotes, loading, fetchPinnedNotes }
}