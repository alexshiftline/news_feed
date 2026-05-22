import { useState } from 'react'
import type { Category } from '../types'
import type { FeedItem } from '../types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../constants'
import ArticleCard from './ArticleCard'

interface Props {
  category: Category
  items: FeedItem[]
  maxItems?: number
}

export default function CategorySection({ category, items, maxItems = 10 }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (items.length === 0) return null

  const visible = expanded ? items : items.slice(0, maxItems)
  const hiddenCount = items.length - maxItems

  return (
    <section style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px 8px',
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        zIndex: 1,
        borderBottom: `1px solid var(--border)`,
      }}>
        <span style={{ fontSize: '13px' }}>{CATEGORY_ICONS[category]}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: `var(--color-${category})`,
        }}>
          {CATEGORY_LABELS[category]}
        </span>
        <div style={{ flex: 1, height: '1px', background: `var(--color-${category})`, opacity: 0.2 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.4 }}>
          {items.length}
        </span>
      </div>

      <div>
        {visible.map(item => (
          <ArticleCard key={item.guid} item={item} />
        ))}
      </div>

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            opacity: 0.5,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
        >
          Show {hiddenCount} more
        </button>
      )}
    </section>
  )
}
