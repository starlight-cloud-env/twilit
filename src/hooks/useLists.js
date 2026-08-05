import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useLists() {
  const { user } = useAuth()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLists([])
      setLoading(false)
      return
    }
    fetchLists()
  }, [user])

  // RLS already restricts rows to lists the user owns or is an accepted
  // member of, so no extra filtering is needed here.
  const fetchLists = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setLists(data)
    setLoading(false)
  }

  const createList = async (listData) => {
    const { error } = await supabase
      .from('lists')
      .insert([{ ...listData, owner_id: user.id }])

    if (error) {
      return { error }
    }

    await fetchLists()
    return { error: null }
  }

  const updateList = async (id, updates) => {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()

    if (!error && data) {
      setLists(prev => prev.map(l => (l.id === id ? data[0] : l)))
    }
    return { data: data?.[0], error }
  }

  const deleteList = async (id) => {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)

    if (!error) {
      setLists(prev => prev.filter(l => l.id !== id))
    }
    return { error }
  }

  return { lists, loading, fetchLists, createList, updateList, deleteList }
}