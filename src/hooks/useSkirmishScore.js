import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useSkirmishScore() {
  const { user } = useAuth()
  const [personalBest, setPersonalBest] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setPersonalBest(0)
      return
    }
    fetchPersonalBest()
  }, [user])

  const fetchPersonalBest = async () => {
    const { data } = await supabase
      .from('skirmish_scores')
      .select('score')
      .eq('user_id', user.id)
      .maybeSingle()

    setPersonalBest(data?.score ?? 0)
  }

  const fetchLeaderboard = useCallback(async () => {
    if (!user) return
    setLeaderboardLoading(true)

    const { data, error } = await supabase
      .from('skirmish_scores')
      .select('score, highest_wave, user_id, profiles(email)')
      .order('score', { ascending: false })
      .limit(10)

    if (!error && data) setLeaderboard(data)
    setLeaderboardLoading(false)
  }, [user])

  // Only writes when the new score actually beats the player's stored
  // best — same reasoning as Nebula, keeps writes meaningful.
  const submitScoreIfBetter = async (score, highestWave) => {
    if (!user || score <= personalBest) return

    const { error } = await supabase
      .from('skirmish_scores')
      .upsert(
        {
          user_id: user.id,
          score,
          highest_wave: highestWave,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (!error) {
      setPersonalBest(score)
    }
  }

  return {
    personalBest,
    leaderboard,
    leaderboardLoading,
    fetchLeaderboard,
    submitScoreIfBetter,
  }
}