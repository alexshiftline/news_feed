import type { FeedItem } from '../types'
import CategoryBadge from './CategoryBadge'
import QrCode from './QrCode'

interface Props {
  item: FeedItem | null
  category: string
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function SkeletonMain() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="skeleton" style={{ height: '20px', width: '120px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="skeleton" style={{ height: '48px', width: '80%' }} />
        <div className="skeleton" style={{ height: '48px', width: '60%' }} />
      </div>
      <div className="skeleton" style={{ height: '16px', width: '200px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton" style={{ height: '16px', width: '100%' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%' }} />
        <div className="skeleton" style={{ height: '16px', width: '75%' }} />
      </div>
    </div>
  )
}

export default function MainPanel({ item, category }: Props) {
  const accentColor = `var(--color-${category})`

  return (
    <div style={{
      position: 'relative',
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderLeft: `4px solid ${accentColor}`,
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {!item ? (
        <SkeletonMain />
      ) : (
        <article
          key={item.guid}
          className="story-enter"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          {/* Left column: story content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
            <CategoryBadge
              category={item.category}
              cvssScore={item.cvssScore}
              isCritical={item.isCritical}
              cveId={item.cveId}
            />

            <h1 style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.title}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                background: 'var(--surface)',
                border: `1px solid ${accentColor}`,
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: accentColor,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}>
                <span style={{ fontSize: '9px' }}>◆</span>
                {item.source}
              </span>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
              }}>
                {formatRelative(item.pubDate)}
              </span>
            </div>

            {item.description && (
              <p style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {item.description}
              </p>
            )}
          </div>

          {/* Right column: QR code */}
          {item.link && (
            <div style={{ flexShrink: 0 }}>
              <QrCode url={item.link} size={175} />
            </div>
          )}
        </article>
      )}
    </div>
  )
}
