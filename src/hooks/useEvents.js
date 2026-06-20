import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabase.js'
import { useAuth } from '../../../../../context/AuthContext.jsx'

export function useEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }
    fetchEvents()
  }, [user])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: true })

    if (!error && data) setEvents(data)
    setLoading(false)
  }

  const createEvent = async (eventData) => {
    const { data, error } = await supabase
      .from('events')
      .insert([{ ...eventData, user_id: user.id }])
      .select()

    if (!error && data) {
      setEvents(prev => [...prev, ...data])
    }
    return { error }
  }

  const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (!error && data) {
      setEvents(prev => prev.map(e => e.id === id ? data[0] : e))
    }
    return { error }
  }

  const deleteEvent = async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id))
    }
    return { error }
  }

  // Expand repeated events into individual occurrences for display
  const getEventsForDate = (dateStr) => {
    return events.filter(event => {
      // Direct date match
      if (event.start_date === dateStr) return true

      // Date range
      if (event.end_date && event.start_date <= dateStr && event.end_date >= dateStr) return true

      // Repeat logic
      if (!event.repeat || event.repeat === 'none') return false

      const start = new Date(event.start_date)
      const check = new Date(dateStr)

      if (check < start) return false

      const diffDays = Math.round((check - start) / (1000 * 60 * 60 * 24))

      if (event.repeat === 'daily') {
        if (event.repeat_count) return diffDays <= event.repeat_count
        return true
      }

      if (event.repeat === 'weekly') {
        const isWeekMatch = diffDays % 7 === 0
        if (event.repeat_count) return isWeekMatch && diffDays / 7 <= event.repeat_count
        return isWeekMatch
      }

      return false
    })
  }

  return { events, loading, createEvent, updateEvent, deleteEvent, getEventsForDate }
}