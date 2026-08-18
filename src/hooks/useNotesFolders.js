import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useNotesFolders() {
  const { user } = useAuth()
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFolders([])
      setLoading(false)
      return
    }
    fetchFolders()
  }, [user])

  // Embeds a note count per folder in one query rather than N+1 requests.
  const fetchFolders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes_folders')
      .select('*, notes(count)')
      .order('created_at', { ascending: false })

    if (!error && data) setFolders(data)
    setLoading(false)
  }

  const createFolder = async (name) => {
    const { error } = await supabase
      .from('notes_folders')
      .insert([{ name, owner_id: user.id }])

    if (error) return { error }

    await fetchFolders()
    return { error: null }
  }

  const deleteFolder = async (id) => {
    const { error } = await supabase
      .from('notes_folders')
      .delete()
      .eq('id', id)

    if (!error) {
      setFolders(prev => prev.filter(f => f.id !== id))
    }
    return { error }
  }

  return { folders, loading, createFolder, deleteFolder, fetchFolders }
}