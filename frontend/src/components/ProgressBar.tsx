import { useEffect, useRef, useState } from 'react'

interface Props {
  durationMs: number
  color: string
  storyKey: string
  elapsedMs?: number
}

export default function ProgressBar({ durationMs, color, storyKey, elapsedMs = 0 }: Props) {
  const [width, setWidth] = useState(() => Math.max(0, 100 - (elapsedMs / durationMs) * 100))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)

    const startedAt = performance.now() - elapsedMs

    function tick(now: number) {
      const elapsed = now - startedAt
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100)
      setWidth(remaining)
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  // elapsedMs intentionally excluded — only re-run when the story key changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyKey, durationMs])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'var(--border)',
    }}>
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: '0 2px 2px 0',
          transition: 'none',
        }}
      />
    </div>
  )
}
