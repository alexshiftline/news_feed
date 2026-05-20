import { useEffect, useRef, useState } from 'react'
import type { FeedItem } from '../types'

interface Props {
  items: FeedItem[]
}

const TICKER_SPEED = 90 // px per second

export default function Ticker({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(120)
  // Only set once — never reset so the animation never restarts mid-scroll
  const initialised = useRef(false)

  useEffect(() => {
    if (initialised.current) return
    if (!trackRef.current || items.length === 0) return
    // Wait one frame for layout to settle
    const raf = requestAnimationFrame(() => {
      if (!trackRef.current) return
      const halfWidth = trackRef.current.scrollWidth / 2
      if (halfWidth > 0) {
        setDuration(halfWidth / TICKER_SPEED)
        initialised.current = true
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [items])

  if (items.length === 0) {
    return (
      <div style={{
        borderTop: '1px solid var(--border)',
        background: '#0a0a12',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        overflow: 'hidden',
      }}>
        <span style={{ color: 'var(--text-dim)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          Loading headlines…
        </span>
      </div>
    )
  }

  const segments = items.map(item => ({
    guid: item.guid,
    category: item.category,
    label: `${item.source.toUpperCase()}: ${item.title}`,
  }))

  const doubled = [...segments, ...segments]

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: '#0a0a12',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* LIVE pill */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        height: '100%',
        borderRight: '1px solid var(--border)',
        background: '#0a0a12',
      }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#ef4444',
          display: 'inline-block',
          boxShadow: '0 0 6px #ef4444',
        }} />
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>
          LIVE
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          ref={trackRef}
          className="ticker-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {doubled.map((seg, idx) => (
            <span key={`${seg.guid}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{
                color: `var(--color-${seg.category})`,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                marginRight: '7px',
              }}>
                ◆
              </span>
              <span style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                paddingRight: '48px',
              }}>
                {seg.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
