import { useEffect, useState } from 'react'
import type { FeedItem, WeekendCatchupResponse } from '../types'

interface WeekendCatchupState {
  items: FeedItem[]
  loading: boolean
}

const POLL_INTERVAL = 15 * 60_000

function isMonday(): boolean {
  return new Date().getDay() === 1
}

export function useWeekendCatchup(): WeekendCatchupState {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isMonday()) return

    let cancelled = false

    async function fetchCatchup() {
      setLoading(true)
      try {
        const res = await fetch('/api/feed/weekend-catchup')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: WeekendCatchupResponse = await res.json()
        if (!cancelled) setItems(data.items)
      } catch {
        // silently fail — catchup section simply won't show
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCatchup()
    const timer = setInterval(fetchCatchup, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return { items, loading }
}
