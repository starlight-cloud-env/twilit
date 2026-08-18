import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useNotes(folderId) {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!folderId) return
    fetchNotes()
  }, [folderId])

  const fetchNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('folder_id', folderId)
      .order('updated_at', { ascending: false })

    if (!error && data) setNotes(data)
    setLoading(false)
  }

  const createNote = async () => {
    const newNote = {
      id: crypto.randomUUID(),
      folder_id: folderId,
      owner_id: user.id,
      title: 'Untitled',
      content: '',
    }

    const { error } = await supabase
      .from('notes')
      .insert([newNote])

    if (error) return { error }

    await fetchNotes()
    return { error: null, id: newNote.id }
  }

  const deleteNote = async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
    return { error }
  }

  return { notes, loading, createNote, deleteNote, fetchNotes }
}