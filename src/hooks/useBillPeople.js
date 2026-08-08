import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useBillPeople(billId) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!billId) return
    fetchPeople()
  }, [billId])

  const fetchPeople = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bill_people')
      .select('*')
      .eq('bill_id', billId)
      .order('created_at', { ascending: true })

    if (!error && data) setPeople(data)
    setLoading(false)
  }

  const addPerson = async (name) => {
    const trimmed = name.trim()
    if (!trimmed) return { error: null }

    const newPerson = { id: crypto.randomUUID(), bill_id: billId, name: trimmed, subtotal: 0 }
    setPeople(prev => [...prev, newPerson])

    const { error } = await supabase
      .from('bill_people')
      .insert([newPerson])

    if (error) {
      setPeople(prev => prev.filter(p => p.id !== newPerson.id))
    }

    return { error }
  }

  const updatePerson = async (id, updates) => {
    const prevPeople = people
    setPeople(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))

    const { error } = await supabase
      .from('bill_people')
      .update(updates)
      .eq('id', id)

    if (error) {
      setPeople(prevPeople)
    }

    return { error }
  }

  const deletePerson = async (id) => {
    const prevPeople = people
    setPeople(prev => prev.filter(p => p.id !== id))

    const { error } = await supabase
      .from('bill_people')
      .delete()
      .eq('id', id)

    if (error) {
      setPeople(prevPeople)
    }

    return { error }
  }

  return { people, loading, addPerson, updatePerson, deletePerson }
}