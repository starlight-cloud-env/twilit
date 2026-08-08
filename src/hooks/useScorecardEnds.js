import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useScorecardEnds(scorecardId) {
  const [ends, setEnds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!scorecardId) return
    fetchEnds()
  }, [scorecardId])

  const fetchEnds = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('archery_ends')
      .select('*')
      .eq('scorecard_id', scorecardId)
      .order('end_number', { ascending: true })

    if (!error && data) setEnds(data)
    setLoading(false)
  }

  const updateEndArrows = async (endId, arrows) => {
    const prevEnds = ends
    setEnds(prev => prev.map(e => (e.id === endId ? { ...e, arrows } : e)))

    const { error } = await supabase
      .from('archery_ends')
      .update({ arrows })
      .eq('id', endId)

    if (error) {
      setEnds(prevEnds)
    }
    return { error }
  }

  return { ends, loading, updateEndArrows }
}