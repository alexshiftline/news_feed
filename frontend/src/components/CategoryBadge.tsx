import type { Category } from '../types'

interface Props {
  category: Category
  cvssScore?: number
  isCritical?: boolean
  cveId?: string
}

const CATEGORY_LABELS: Record<Category, string> = {
  security: 'SECURITY',
  ai: 'AI',
  dev: 'DEV',
  tech: 'TECH',
  cloud: 'CLOUD',
}

export default function CategoryBadge({ category, cvssScore, isCritical, cveId }: Props) {
  const label = CATEGORY_LABELS[category]

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-mono)',
          color: `var(--color-${category})`,
          border: `1px solid var(--color-${category})`,
          opacity: 0.9,
        }}
      >
        {label}
      </span>

      {cvssScore !== undefined && (
        <span
          className={isCritical ? 'badge-critical' : undefined}
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-mono)',
            backgroundColor: isCritical ? 'var(--color-critical)' : '#ea580c',
            color: '#fff',
          }}
        >
          CVSS {cvssScore.toFixed(1)} {isCritical ? 'CRITICAL' : 'HIGH'}
        </span>
      )}

      {cveId && (
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          {cveId}
        </span>
      )}
    </div>
  )
}
