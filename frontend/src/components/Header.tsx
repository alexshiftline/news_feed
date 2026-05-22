import { useEffect, useState } from 'react'

interface Props {
  onRefresh: () => void
  isRefreshing: boolean
}

function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  })
  const dateStr = time.toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Johannesburg',
  })

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
      {dateStr} &nbsp; {timeStr} <span style={{ opacity: 0.5 }}>SAST</span>
    </span>
  )
}

export default function Header({ onRefresh, isRefreshing }: Props) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '52px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
          INTELLIGENCE FEED
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Clock />
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh feed"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            padding: '5px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            opacity: isRefreshing ? 0.5 : 1,
            transition: 'opacity 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { if (!isRefreshing) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-secondary)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
        >
          {isRefreshing ? 'REFRESHING...' : '↻ REFRESH'}
        </button>
      </div>
    </header>
  )
}
