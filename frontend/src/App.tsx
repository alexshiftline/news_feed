import { useEffect, useState } from 'react'
import { useFeed } from './hooks/useFeed'
import { useWeather } from './hooks/useWeather'
import MainPanel from './components/MainPanel'
import MiniQueue from './components/MiniQueue'
import Ticker from './components/Ticker'
import WeatherPanel from './components/WeatherPanel'
import DuckPet from './components/DuckPet'
import type { Category, FeedItem } from './types'

const SLOT_ORDER: Category[] = ['security', 'ai', 'dev', 'tech', 'cloud', 'world']

const STORIES_PER_SLOT = 5
const STORY_DURATION_MS = 15_000

const SLOT_REPEATS: Record<Category, number> = {
  security: 3,
  ai:       1,
  dev:      3,
  tech:     3,
  cloud:    3,
  world:    2,
}

const SLOT_DURATIONS = SLOT_ORDER.map(cat => STORY_DURATION_MS * STORIES_PER_SLOT * SLOT_REPEATS[cat])
const SLOT_OFFSETS = SLOT_DURATIONS.reduce<number[]>((acc, d) => {
  acc.push((acc[acc.length - 1] ?? 0) + d)
  return acc
}, [])
const CYCLE_MS = SLOT_OFFSETS[SLOT_OFFSETS.length - 1]

function getCyclePosition(): { slotIndex: number; storyIndex: number; repeatIndex: number } {
  const elapsed = Date.now() % CYCLE_MS
  const slotIndex = SLOT_OFFSETS.findIndex(offset => elapsed < offset)
  const slotStart = slotIndex === 0 ? 0 : SLOT_OFFSETS[slotIndex - 1]
  const withinSlot = elapsed - slotStart
  const absoluteStory = Math.floor(withinSlot / STORY_DURATION_MS)
  return {
    slotIndex,
    storyIndex: absoluteStory % STORIES_PER_SLOT,
    repeatIndex: Math.floor(absoluteStory / STORIES_PER_SLOT),
  }
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-mono)',
      fontSize: '14px',
      color: 'var(--text-secondary)',
    }}>
      <span>{dateStr.toUpperCase()}</span>
      <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700 }}>
        {timeStr}
      </span>
      <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>SAST</span>
    </div>
  )
}

export const CATEGORY_LABELS: Record<Category, string> = {
  security: 'SECURITY',
  ai:       'AI / ML',
  dev:      'DEVELOPER',
  tech:     'TECH',
  cloud:    'CLOUD',
  world:    'WORLD',
}

function getItemsForCategory(items: FeedItem[], category: Category): FeedItem[] {
  return items
    .filter(i => i.category === category)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
}

export default function App() {
  const { items } = useFeed()
  const { weather } = useWeather()

  const [position, setPosition] = useState(getCyclePosition)

  useEffect(() => {
    const timer = setInterval(() => setPosition(getCyclePosition()), 500)
    return () => clearInterval(timer)
  }, [])

  const { slotIndex, storyIndex, repeatIndex } = position

  const currentCategory = SLOT_ORDER[slotIndex % SLOT_ORDER.length]
  const categoryItems = getItemsForCategory(items, currentCategory)
  const effectiveStory = categoryItems.length > 0 ? storyIndex % categoryItems.length : 0
  const mainItem = categoryItems[effectiveStory] ?? null
  const queueItems = categoryItems.slice(effectiveStory + 1, effectiveStory + 1 + 4)
  const tickerItems = items.slice(0, 40)

  const categoryAccent = `var(--color-${currentCategory})`

  return (
    <div style={{
      display: 'grid',
      height: '100vh',
      width: '100vw',
      gridTemplateRows: '52px 1fr 96px 48px',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            color: 'var(--color-security)',
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>◉</span>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--text-primary)',
          }}>
            ENRICHED NEWS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              padding: '4px 12px',
              border: `1px solid ${categoryAccent}`,
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: categoryAccent,
              fontFamily: 'var(--font-mono)',
            }}>
              {CATEGORY_LABELS[currentCategory]}
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
            }}>
              {repeatIndex + 1}/{SLOT_REPEATS[currentCategory]}
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
          <Clock />
        </div>
      </header>

      {/* Main content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        <MainPanel item={mainItem} category={currentCategory} />
        <WeatherPanel
          weather={weather}
          slotOrder={SLOT_ORDER}
          currentSlotIndex={slotIndex}
          categoryLabels={CATEGORY_LABELS}
        />
      </div>

      {/* Mini queue */}
      <MiniQueue items={queueItems} />

      {/* Ticker */}
      <Ticker items={tickerItems} />

      {/* Duck pet — walks on top of the ticker */}
      <DuckPet />
    </div>
  )
}
