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

const ANIMS = {
  idle:     { frames: [r1c1, r1c2],                          fps: 2,  speed: 0  },
  walkSlow: { frames: [r2c1, r2c2, r2c3, r2c4, r2c5, r2c6], fps: 8,  speed: 40 },
  bounce:   { frames: [r3c1, r3c2, r3c3, r3c4],              fps: 6,  speed: 0  },
  walkFast: { frames: [r4c1, r4c2, r4c3, r4c4, r4c5, r4c6], fps: 12, speed: 80 },
} as const

type AnimName = keyof typeof ANIMS

const BEHAVIOURS: [AnimName, number][] = [
  ['idle',     3000],
  ['walkSlow', 4000],
  ['idle',     2000],
  ['bounce',   2500],
  ['walkFast', 5000],
  ['idle',     2000],
  ['walkSlow', 6000],
  ['bounce',   1500],
  ['walkFast', 4000],
  ['idle',     3500],
]

const SCALE = 3
const DUCK_W = 25 * SCALE

export default function DuckPet() {
  // Everything in refs so the single master tick never has stale closures
  const animRef   = useRef<AnimName>('idle')
  const frameRef  = useRef(0)
  const xRef      = useRef(120)
  const dirRef    = useRef(1)
  const flipRef   = useRef(false)
  const widthRef  = useRef(window.innerWidth)

  // Only rendered state — drives the actual DOM update
  const [src,  setSrc]  = useState(ANIMS.idle.frames[0])
  const [x,    setX]    = useState(120)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    const onResize = () => { widthRef.current = window.innerWidth }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    // Behaviour sequencer
    let cancelled = false
    let idx = 0
    ;(async () => {
      while (!cancelled) {
        const [name, ms] = BEHAVIOURS[idx % BEHAVIOURS.length]
        idx++
        animRef.current = name
        frameRef.current = 0
        await new Promise<void>(res => setTimeout(res, ms))
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    // Single master tick: advances frame + position
    const TICK = 80 // ms — ~12.5 ticks/s, enough for 12fps max

    const id = setInterval(() => {
      const anim = ANIMS[animRef.current]

      // Advance frame
      frameRef.current = (frameRef.current + 1) % anim.frames.length
      setSrc(anim.frames[frameRef.current])

      // Move position
      if (anim.speed > 0) {
        const dx = (anim.speed * TICK) / 1000
        const maxX = widthRef.current - DUCK_W - 4
        let newX = xRef.current + dirRef.current * dx

        if (newX <= 0) {
          newX = 0
          dirRef.current = 1
          flipRef.current = false
          setFlip(false)
        } else if (newX >= maxX) {
          newX = maxX
          dirRef.current = -1
          flipRef.current = true
          setFlip(true)
        }

        xRef.current = newX
        setX(newX)
      }
    }, TICK)

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
        src={src}
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
