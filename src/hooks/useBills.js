import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useBills() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setBills([])
      setLoading(false)
      return
    }
    fetchBills()
  }, [user])

  const fetchBills = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setBills(data)
    setLoading(false)
  }

  const createBill = async (billData) => {
    const { error } = await supabase
      .from('bills')
      .insert([{ ...billData, owner_id: user.id }])

    if (error) return { error }

    await fetchBills()
    return { error: null }
  }

  const updateBill = async (id, updates) => {
    const { error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)

    if (error) return { error }

    setBills(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)))
    return { error: null }
  }

  const deleteBill = async (id) => {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)

    if (!error) {
      setBills(prev => prev.filter(b => b.id !== id))
    }
    return { error }
  }

  return { bills, loading, fetchBills, createBill, updateBill, deleteBill }
}