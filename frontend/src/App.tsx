import { useMemo, useState } from 'react'
import { useFeed } from './hooks/useFeed'
import { useWeekendCatchup } from './hooks/useWeekendCatchup'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import FeedView from './components/FeedView'
import type { Category } from './types'
type Filter = Category | 'all'

export default function App() {
  const { items, loading, error, refresh, isRefreshing } = useFeed()
  const { items: weekendItems } = useWeekendCatchup()
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, security: 0, ai: 0, dev: 0, tech: 0, cloud: 0, world: 0 }
    for (const item of items) c[item.category]++
    return c
  }, [items])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Header onRefresh={refresh} isRefreshing={isRefreshing} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
      <FeedView
        items={items}
        weekendItems={weekendItems}
        activeFilter={activeFilter}
        loading={loading}
        error={error}
      />
    </div>
  )
}