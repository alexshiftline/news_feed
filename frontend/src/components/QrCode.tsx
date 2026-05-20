import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

interface Props {
  url: string
  size?: number
}

export default function QrCode({ url, size = 128 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !url) return

    QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',  // dark modules — standard for scanner compatibility
        light: '#ffffff', // white background
      },
    }).catch(() => {})
  }, [url, size])

  if (!url) return null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: '#ffffff',
          display: 'block',
        }}
      />
      <span style={{
        fontSize: '10px',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
      }}>
        SCAN TO READ
      </span>
    </div>
  )
}
