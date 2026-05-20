import { useEffect, useRef, useState } from 'react'

import r1c1 from '../sprites/duck_r1_c1.png'
import r1c2 from '../sprites/duck_r1_c2.png'
import r2c1 from '../sprites/duck_r2_c1.png'
import r2c2 from '../sprites/duck_r2_c2.png'
import r2c3 from '../sprites/duck_r2_c3.png'
import r2c4 from '../sprites/duck_r2_c4.png'
import r2c5 from '../sprites/duck_r2_c5.png'
import r2c6 from '../sprites/duck_r2_c6.png'
import r3c1 from '../sprites/duck_r3_c1.png'
import r3c2 from '../sprites/duck_r3_c2.png'
import r3c3 from '../sprites/duck_r3_c3.png'
import r3c4 from '../sprites/duck_r3_c4.png'
import r4c1 from '../sprites/duck_r4_c1.png'
import r4c2 from '../sprites/duck_r4_c2.png'
import r4c3 from '../sprites/duck_r4_c3.png'
import r4c4 from '../sprites/duck_r4_c4.png'
import r4c5 from '../sprites/duck_r4_c5.png'
import r4c6 from '../sprites/duck_r4_c6.png'

// All frames as a flat indexed array so we can set by index rather than object ref
const ALL_FRAMES = [
  // idle: 0,1
  r1c1, r1c2,
  // walkSlow: 2..7
  r2c1, r2c2, r2c3, r2c4, r2c5, r2c6,
  // bounce: 8..11
  r3c1, r3c2, r3c3, r3c4,
  // walkFast: 12..17
  r4c1, r4c2, r4c3, r4c4, r4c5, r4c6,
]

interface Anim { start: number; len: number; fps: number; speed: number }
const ANIMS: Record<string, Anim> = {
  idle:     { start: 0,  len: 2, fps: 2,  speed: 0  },
  walkSlow: { start: 2,  len: 6, fps: 8,  speed: 40 },
  bounce:   { start: 8,  len: 4, fps: 6,  speed: 0  },
  walkFast: { start: 12, len: 6, fps: 12, speed: 80 },
}

const BEHAVIOURS: [string, number][] = [
  ['idle',     3000],
  ['walkSlow', 5000],
  ['idle',     2000],
  ['bounce',   2500],
  ['walkFast', 6000],
  ['idle',     2500],
  ['walkSlow', 7000],
  ['bounce',   2000],
  ['walkFast', 5000],
]

// Original sprites ~22×27px. SCALE=1 keeps native size, quarter of SCALE=3 original.
const SCALE = 1
const DUCK_W = 25 * SCALE  // px

export default function DuckPet() {
  const imgRef = useRef<HTMLImageElement>(null)

  // All mutable state in refs — no React state for animation hot path
  const animNameRef   = useRef('idle')
  const frameRef      = useRef(0)
  const frameTickRef  = useRef(0) // counts ticks per frame
  const xRef          = useRef(120)
  const dirRef        = useRef(1)
  const widthRef      = useRef(window.innerWidth)
  const behavIdxRef   = useRef(0)
  const behavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only x and flip need React state for DOM positioning
  const [x,    setX]    = useState(120)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    const onResize = () => { widthRef.current = window.innerWidth }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Behaviour sequencer — plain setTimeout chain, no async/await
  useEffect(() => {
    function next() {
      const [name, ms] = BEHAVIOURS[behavIdxRef.current % BEHAVIOURS.length]
      behavIdxRef.current++
      animNameRef.current = name
      frameRef.current = 0
      frameTickRef.current = 0
      behavTimerRef.current = setTimeout(next, ms)
    }
    next()
    return () => { if (behavTimerRef.current) clearTimeout(behavTimerRef.current) }
  }, [])

  // Master tick — drives frame + position, writes directly to DOM via ref
  useEffect(() => {
    const TICK_MS = 80

    const id = setInterval(() => {
      const anim = ANIMS[animNameRef.current]

      // Advance frame based on fps vs tick rate
      const ticksPerFrame = Math.max(1, Math.round((1000 / anim.fps) / TICK_MS))
      frameTickRef.current++
      if (frameTickRef.current >= ticksPerFrame) {
        frameTickRef.current = 0
        frameRef.current = (frameRef.current + 1) % anim.len
        // Write src directly to DOM — no React re-render
        if (imgRef.current) {
          imgRef.current.src = ALL_FRAMES[anim.start + frameRef.current]
        }
      }

      // Move
      if (anim.speed > 0) {
        const dx = (anim.speed * TICK_MS) / 1000
        const maxX = widthRef.current - DUCK_W - 4
        let newX = xRef.current + dirRef.current * dx

        if (newX <= 0) {
          newX = 0
          dirRef.current = 1
          imgRef.current && (imgRef.current.style.transform = 'scaleX(1)')
          setFlip(false)
        } else if (newX >= maxX) {
          newX = maxX
          dirRef.current = -1
          imgRef.current && (imgRef.current.style.transform = 'scaleX(-1)')
          setFlip(true)
        }

        xRef.current = newX
        if (imgRef.current) imgRef.current.style.left = `${newX}px`
        setX(newX)
      }
    }, TICK_MS)

    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: '48px',
      left: 0,
      right: 0,
      pointerEvents: 'none',
      zIndex: 50,
    }}>
      <img
        ref={imgRef}
        src={ALL_FRAMES[0]}
        alt=""
        style={{
          position: 'absolute',
          left: `${x}px`,
          bottom: 0,
          width: `${DUCK_W}px`,
          imageRendering: 'pixelated',
          transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      />
    </div>
  )
}
