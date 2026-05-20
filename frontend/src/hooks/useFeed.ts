import { useEffect, useRef, useState } from 'react'
import type { FeedItem, FeedResponse } from '../types'

interface FeedState {
  items: FeedItem[]
  loading: boolean
  error: string | null
  totalCount: number
}

const POLL_INTERVAL = 60_000

export function useFeed(): FeedState {
  const [state, setState] = useState<FeedState>({
    items: [],
    loading: true,
    error: null,
    totalCount: 0,
  })
  const prevItems = useRef<FeedItem[]>([])

  useEffect(() => {
    let cancelled = false

    async function fetchFeed() {
      try {
        const res = await fetch('/api/feed')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: FeedResponse = await res.json()
        if (cancelled) return
        prevItems.current = data.items
        setState({ items: data.items, loading: false, error: null, totalCount: data.totalCount })
      } catch (err) {
        if (cancelled) return
        setState(prev => ({
          ...prev,
          loading: false,
          error: (err as Error).message,
          items: prevItems.current,
        }))
      }
    }

    fetchFeed()
    const timer = setInterval(fetchFeed, POLL_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return state
}
