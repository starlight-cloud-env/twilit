import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useListMembers(listId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!listId) return
    fetchMembers()
  }, [listId])

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('list_members')
      .select('*')
      .eq('list_id', listId)
      .order('invited_at', { ascending: true })

    if (!error && data) setMembers(data)
    setLoading(false)
  }

  const inviteMember = async (email) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return { error: { message: 'Please enter an email' } }

    // Look up whether this person already has a Twilit account, so we can
    // link them immediately instead of waiting for them to sign up.
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    const { error } = await supabase
      .from('list_members')
      .insert([{
        id: crypto.randomUUID(),
        list_id: listId,
        invited_email: normalizedEmail,
        user_id: profile?.id ?? null,
        status: 'pending',
      }])

    if (error) {
      if (error.code === '23505') {
        return { error: { message: 'This person has already been invited.' } }
      }
      return { error }
    }

    await fetchMembers()
    return { error: null }
  }

  const removeMember = async (id) => {
    const prevMembers = members
    setMembers(prev => prev.filter(m => m.id !== id))

    const { error } = await supabase
      .from('list_members')
      .delete()
      .eq('id', id)

    if (error) {
      setMembers(prevMembers)
    }

    return { error }
  }

  return { members, loading, inviteMember, removeMember }
}