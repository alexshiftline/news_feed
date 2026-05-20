import type { Category, WeatherData } from '../types'

interface Props {
  weather: WeatherData | null
  slotOrder: Category[]
  currentSlotIndex: number
  categoryLabels: Record<Category, string>
}

export default function WeatherPanel({ weather, slotOrder, currentSlotIndex, categoryLabels }: Props) {
  const current = weather?.current ?? null
  const forecast = weather?.forecast ?? []

  return (
    <aside style={{
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {/* Weather section */}
      <div style={{ padding: 'clamp(10px, 2vh, 20px) clamp(10px, 1.5vw, 20px)', display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 12px)', flexShrink: 0 }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-weather)',
          fontSize: 'clamp(9px, 1vh, 11px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-mono)',
        }}>
          <span>◉</span>
          <span>CAPE TOWN</span>
        </header>

        {!current ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            Loading weather…
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontSize: 'clamp(24px, 5vh, 44px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}>
                {current.tempC}°
              </span>
              <span style={{ fontSize: 'clamp(14px, 2.5vh, 22px)' }}>{current.icon}</span>
            </div>

            <div style={{ fontSize: 'clamp(11px, 1.4vh, 13px)', color: 'var(--text-secondary)' }}>
              {current.description}
            </div>

            <div style={{ fontSize: 'clamp(10px, 1.2vh, 12px)', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Feels {current.feelsLikeC}° · {current.windKph} km/h {current.windDir}
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.8vh, 8px)' }}>
              {forecast.map(day => (
                <div key={day.date} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 'clamp(9px, 1.1vh, 11px)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', width: '32px' }}>
                    {day.date.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 'clamp(12px, 1.8vh, 15px)' }}>{day.icon}</span>
                  <span style={{ fontSize: 'clamp(9px, 1.1vh, 11px)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {day.maxC}° <span style={{ color: 'var(--text-dim)' }}>/ {day.minC}°</span>
                  </span>
                </div>
              ))}
            </div>

            {weather && (
              <div style={{ fontSize: 'clamp(8px, 1vh, 10px)', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Updated {new Date(weather.fetchedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '0 clamp(8px, 1.2vw, 20px)', flexShrink: 0 }} />

      {/* Topic cycle indicator — scrollable so it never clips */}
      <div style={{ padding: 'clamp(8px, 1.5vh, 14px) clamp(10px, 1.5vw, 20px)', display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.8vh, 6px)', overflowY: 'auto', minHeight: 0 }}>
        <div style={{
          fontSize: 'clamp(8px, 1vh, 10px)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          marginBottom: '2px',
          flexShrink: 0,
        }}>
          UP NEXT
        </div>
        {slotOrder.map((cat, idx) => {
          const isCurrent = idx === currentSlotIndex % slotOrder.length
          const isPast = idx < currentSlotIndex % slotOrder.length
          return (
            <div
              key={`${cat}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isPast ? 0.3 : 1,
                flexShrink: 0,
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                background: isCurrent ? `var(--color-${cat})` : 'var(--border)',
                boxShadow: isCurrent ? `0 0 6px var(--color-${cat})` : 'none',
              }} />
              <span style={{
                fontSize: 'clamp(9px, 1.1vh, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: isCurrent ? 700 : 400,
                color: isCurrent ? `var(--color-${cat})` : 'var(--text-secondary)',
                letterSpacing: '0.05em',
              }}>
                {categoryLabels[cat]}
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
