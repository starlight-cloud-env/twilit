import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])

  // Load bookmarks when user signs in
  // In Phase 4 this will fetch from Supabase
  // For now we use localStorage as a placeholder
  useEffect(() => {
    if (!user) {
      setBookmarks([])
      return
    }
    const saved = localStorage.getItem('twilit-bookmarks')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [user])

  const addBookmark = (serviceId) => {
    if (!user) return
    setBookmarks(prev => {
      const updated = [...new Set([...prev, serviceId])]
      localStorage.setItem('twilit-bookmarks', JSON.stringify(updated))
      return updated
    })
  }

  const removeBookmark = (serviceId) => {
    if (!user) return
    setBookmarks(prev => {
      const updated = prev.filter(id => id !== serviceId)
      localStorage.setItem('twilit-bookmarks', JSON.stringify(updated))
      return updated
    })
  }

  const isBookmarked = (serviceId) => bookmarks.includes(serviceId)

  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}