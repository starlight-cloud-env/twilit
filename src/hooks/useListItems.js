import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useListItems(listId) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!listId) return
    fetchItems()
  }, [listId])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', listId)
      .order('position', { ascending: true })

    if (!error && data) setItems(data)
    setLoading(false)
  }

  // Generating the id client-side means we never need to chain .select()
  // after .insert() — sidesteps the RLS/SELECT-on-RETURNING issue entirely
  // and gives us snappy optimistic UI as a bonus.
  const addItem = async (content) => {
    const trimmed = content.trim()
    if (!trimmed) return { error: null }

    const newItem = {
      id: crypto.randomUUID(),
      list_id: listId,
      content: trimmed,
      is_checked: false,
      position: items.length,
      created_by: user.id,
    }

    setItems(prev => [...prev, newItem])

    const { error } = await supabase
      .from('list_items')
      .insert([newItem])

    if (error) {
      setItems(prev => prev.filter(i => i.id !== newItem.id))
    }

    return { error }
  }

  const toggleItem = async (id, isChecked) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, is_checked: isChecked } : i)))

    const { error } = await supabase
      .from('list_items')
      .update({ is_checked: isChecked })
      .eq('id', id)

    if (error) {
      setItems(prev => prev.map(i => (i.id === id ? { ...i, is_checked: !isChecked } : i)))
    }

    return { error }
  }

  const deleteItem = async (id) => {
    const prevItems = items
    setItems(prev => prev.filter(i => i.id !== id))

    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', id)

    if (error) {
      setItems(prevItems)
    }

    return { error }
  }

  return { items, loading, addItem, toggleItem, deleteItem }
}