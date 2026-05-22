import type { Category, FeedItem } from '../types'
import { CATEGORY_ORDER } from '../constants'
import ArticleCard from './ArticleCard'
import CategorySection from './CategorySection'
import WeekendCatchup from './WeekendCatchup'

type Filter = Category | 'all'

interface Props {
  items: FeedItem[]
  weekendItems: FeedItem[]
  activeFilter: Filter
  loading: boolean
  error: string | null
}

function SkeletonCard() {
  return (
    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ height: '16px', width: '80px', borderRadius: '4px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ height: '14px', width: '70%', borderRadius: '4px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px' }} />
    </div>
  )
}

function isMonday() {
  return new Date().getDay() === 1
}

export default function FeedView({ items, weekendItems, activeFilter, loading, error }: Props) {
  if (loading) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' }} className="feed-view">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="feed-view">
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-critical)',
          padding: '16px 24px',
          border: '1px solid var(--color-critical)',
          borderRadius: '6px',
          opacity: 0.8,
        }}>
          FEED ERROR: {error}
        </div>
      </div>
    )
  }

  if (activeFilter !== 'all') {
    const filtered = items.filter(i => i.category === activeFilter)
    return (
      <div style={{ flex: 1, overflowY: 'auto' }} className="feed-view">
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.4 }}>
            No articles yet
          </div>
        ) : (
          filtered.map(item => <ArticleCard key={item.guid} item={item} />)
        )}
      </div>
    )
  }

  const byCategory: Record<Category, FeedItem[]> = {
    security: [], ai: [], dev: [], tech: [], cloud: [], world: [],
  }
  for (const item of items) {
    byCategory[item.category].push(item)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }} className="feed-view">
      {isMonday() && <WeekendCatchup items={weekendItems} loading={false} />}
      {CATEGORY_ORDER.map(cat => (
        <CategorySection key={cat} category={cat} items={byCategory[cat]} />
      ))}
    </div>
  )
}
