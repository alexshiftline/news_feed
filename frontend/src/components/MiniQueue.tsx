import type { FeedItem } from '../types'

interface Props {
  items: FeedItem[]
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h`
}

export default function MiniQueue({ items }: Props) {
  if (items.length === 0) {
    return (
      <div style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px',
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ flex: 1, height: '52px', borderRadius: '6px' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {items.map((item, idx) => (
        <div
          key={item.guid}
          style={{
            flex: 1,
            padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.2vw, 14px)',
            borderLeft: idx === 0 ? `3px solid var(--color-${item.category})` : undefined,
            borderRight: `1px solid var(--border)`,
            ...(idx > 0 ? { borderLeft: `3px solid var(--color-${item.category})` } : {}),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '5px',
            overflow: 'hidden',
            cursor: item.link ? 'pointer' : 'default',
          }}
          onClick={() => item.link && window.open(item.link, '_blank', 'noopener')}
        >
          <div style={{
            fontSize: 'clamp(11px, 1.5vh, 14px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}>
            {item.title}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            <span style={{ color: `var(--color-${item.category})`, fontWeight: 700, flexShrink: 0 }}>
              {item.category.toUpperCase()}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.source}
            </span>
            <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>·</span>
            <span style={{ flexShrink: 0 }}>{formatRelative(item.pubDate)}</span>
            {item.cvssScore !== undefined && (
              <>
                <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>·</span>
                <span style={{ color: item.isCritical ? '#ef4444' : '#ea580c', fontWeight: 700, flexShrink: 0 }}>
                  {item.cvssScore.toFixed(1)}
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
