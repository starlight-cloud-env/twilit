import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useSkirmishScore() {
  const { user } = useAuth()
  const [personalBest, setPersonalBest] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const fetchSeqRef = useRef(0)

  useEffect(() => {
    if (!user) {
      setPersonalBest(0)
      return
    }
    fetchPersonalBest()
  }, [user])

  const fetchPersonalBest = async () => {
    const { data, error } = await supabase
      .from('skirmish_scores')
      .select('score')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch Skirmish personal best:', error)
      return
    }

    setPersonalBest(data?.score ?? 0)
  }

  // Sequence-guarded so an older, slower request can't overwrite a
  // newer one just because its response happens to arrive later.
  const fetchLeaderboard = useCallback(async () => {
    if (!user) return
    const seq = ++fetchSeqRef.current
    setLeaderboardLoading(true)

    const { data, error } = await supabase
      .from('skirmish_scores')
      .select('score, highest_wave, user_id, profiles(email)')
      .order('score', { ascending: false })
      .limit(10)

    if (seq !== fetchSeqRef.current) return // superseded by a newer fetch

    if (error) {
      console.error('Failed to fetch Skirmish leaderboard:', error)
      setLeaderboardLoading(false)
      return
    }

    if (data) setLeaderboard(data)
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

    if (error) {
      console.error('Failed to submit Skirmish score:', error)
      return
    }

    setPersonalBest(score)
  }

  return {
    personalBest,
    leaderboard,
    leaderboardLoading,
    fetchLeaderboard,
    submitScoreIfBetter,
  }
}