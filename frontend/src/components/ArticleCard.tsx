import type { FeedItem } from '../types'
import CategoryBadge from './CategoryBadge'
import { formatRelative } from '../utils/formatRelative'

interface Props {
  item: FeedItem
}

export default function ArticleCard({ item }: Props) {
  const isCritical = item.isCritical === true

  return (
    <article
      className="article-card"
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        borderLeft: isCritical ? '3px solid var(--color-critical)' : '3px solid transparent',
        background: isCritical ? 'rgba(220, 38, 38, 0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
        <CategoryBadge
          category={item.category}
          cvssScore={item.cvssScore}
          isCritical={item.isCritical}
          cveId={item.cveId}
        />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          opacity: 0.6,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          paddingTop: '3px',
        }}>
          {formatRelative(item.pubDate)}
        </span>
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          lineHeight: 1.4,
          marginBottom: '4px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
      >
        {item.title}
      </a>

      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6, marginBottom: item.description ? '6px' : 0 }}>
        {item.source}
      </div>

      {item.description && (
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>
      )}
    </article>
  )
}
