import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function usePendingInvites() {
  const { user } = useAuth()
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setInvites([])
      setLoading(false)
      return
    }
    fetchInvites()
  }, [user])

  const fetchInvites = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('list_members')
      .select('*, lists(name, category)')
      .eq('status', 'pending')
      .or(`user_id.eq.${user.id},invited_email.eq.${user.email}`)

    if (!error && data) setInvites(data)
    setLoading(false)
  }

  const acceptInvite = async (memberRowId) => {
    const prevInvites = invites
    setInvites(prev => prev.filter(i => i.id !== memberRowId))

    const { error } = await supabase
      .from('list_members')
      .update({ status: 'accepted', user_id: user.id })
      .eq('id', memberRowId)

    if (error) {
      setInvites(prevInvites)
    }

    return { error }
  }

  const declineInvite = async (memberRowId) => {
    const prevInvites = invites
    setInvites(prev => prev.filter(i => i.id !== memberRowId))

    const { error } = await supabase
      .from('list_members')
      .delete()
      .eq('id', memberRowId)

    if (error) {
      setInvites(prevInvites)
    }

    return { error }
  }

  return { invites, loading, acceptInvite, declineInvite, refetch: fetchInvites }
}