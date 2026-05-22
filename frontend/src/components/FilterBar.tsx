import type { Category } from '../types'
import { CATEGORY_ORDER, CATEGORY_LABELS, CATEGORY_ICONS } from '../constants'

type Filter = Category | 'all'

interface Props {
  activeFilter: Filter
  onFilterChange: (f: Filter) => void
  counts: Record<Filter, number>
}

const ALL_FILTERS: Filter[] = ['all', ...CATEGORY_ORDER]

export default function FilterBar({ activeFilter, onFilterChange, counts }: Props) {
  return (
    <nav style={{
      display: 'flex',
      gap: '6px',
      padding: '10px 20px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      overflowX: 'auto',
      background: 'var(--bg)',
    }}>
      {ALL_FILTERS.map(filter => {
        const isActive = filter === activeFilter
        const color = filter === 'all' ? '#6366f1' : `var(--color-${filter})`
        const label = filter === 'all' ? 'ALL' : CATEGORY_LABELS[filter]
        const icon = CATEGORY_ICONS[filter]
        const count = counts[filter] ?? 0

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${isActive ? color : 'var(--border)'}`,
              background: isActive ? `${color}18` : 'transparent',
              color: isActive ? color : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: isActive ? 700 : 400,
              letterSpacing: '0.07em',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
            <span style={{
              fontSize: '10px',
              opacity: 0.6,
              background: isActive ? `${color}30` : 'var(--surface)',
              padding: '1px 5px',
              borderRadius: '4px',
            }}>
              {count}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
