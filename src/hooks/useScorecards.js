import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { TOTAL_ENDS } from '../pages/features/Archery/constants.js'

export function useScorecards() {
  const { user } = useAuth()
  const [scorecards, setScorecards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setScorecards([])
      setLoading(false)
      return
    }
    fetchScorecards()
  }, [user])

  const fetchScorecards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('archery_scorecards')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setScorecards(data)
    setLoading(false)
  }

  const createScorecard = async ({ name, mode }) => {
    const scorecardId = crypto.randomUUID()

    const { error: scorecardError } = await supabase
      .from('archery_scorecards')
      .insert([{ id: scorecardId, name, mode, owner_id: user.id }])

    if (scorecardError) return { error: scorecardError }

    const endRows = Array.from({ length: TOTAL_ENDS }, (_, i) => ({
      id: crypto.randomUUID(),
      scorecard_id: scorecardId,
      end_number: i + 1,
      arrows: [],
    }))

    const { error: endsError } = await supabase
      .from('archery_ends')
      .insert(endRows)

    if (endsError) return { error: endsError }

    await fetchScorecards()
    return { error: null, id: scorecardId }
  }

  const deleteScorecard = async (id) => {
    const { error } = await supabase
      .from('archery_scorecards')
      .delete()
      .eq('id', id)

    if (!error) {
      setScorecards(prev => prev.filter(s => s.id !== id))
    }
    return { error }
  }

  return { scorecards, loading, createScorecard, deleteScorecard, fetchScorecards }
}