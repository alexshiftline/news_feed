import type { FeedItem } from '../types'
import ArticleCard from './ArticleCard'

interface Props {
  items: FeedItem[]
  loading: boolean
}

export default function WeekendCatchup({ items, loading }: Props) {
  if (loading || items.length === 0) return null

  return (
    <section style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px 8px',
        background: 'rgba(217, 119, 6, 0.08)',
        borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
        borderLeft: '3px solid #d97706',
      }}>
        <span style={{ fontSize: '13px' }}>⚠</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#d97706',
        }}>
          WEEKEND CATCH-UP
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7 }}>
          — Security &amp; CVE highlights from Friday–Sunday
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#d97706', opacity: 0.6 }}>
          {items.length} items
        </span>
      </div>
      <div>
        {items.map(item => (
          <ArticleCard key={item.guid} item={item} />
        ))}
      </div>
    </section>
  )
}
