import { useCallback, useEffect, useRef, useState } from 'react'
import type { FeedItem, FeedResponse } from '../types'

interface FeedState {
  items: FeedItem[]
  loading: boolean
  error: string | null
  totalCount: number
  refresh: () => void
  isRefreshing: boolean
}

const POLL_INTERVAL = 60_000

export function useFeed(): FeedState {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const prevItems = useRef<FeedItem[]>([])
  const cancelledRef = useRef(false)

  const fetchFeed = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true)
    try {
      const res = await fetch('/api/feed/all')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FeedResponse = await res.json()
      if (cancelledRef.current) return
      prevItems.current = data.items
      setItems(data.items)
      setTotalCount(data.totalCount)
      setError(null)
      setLoading(false)
    } catch (err) {
      if (cancelledRef.current) return
      setError((err as Error).message)
      setItems(prevItems.current)
      setLoading(false)
    } finally {
      if (!cancelledRef.current) setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    cancelledRef.current = false
    fetchFeed()
    const timer = setInterval(() => fetchFeed(), POLL_INTERVAL)
    return () => {
      cancelledRef.current = true
      clearInterval(timer)
    }
  }, [fetchFeed])

  const refresh = useCallback(() => fetchFeed(true), [fetchFeed])

  return { items, loading, error, totalCount, refresh, isRefreshing }
}
