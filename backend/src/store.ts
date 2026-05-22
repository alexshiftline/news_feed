import type { Category, FeedItem } from './types.js'
import { SLOT_ORDER, STORIES_PER_SLOT } from './config/weights.js'

const MAX_AGE_MS = 72 * 60 * 60 * 1000
const MAX_STORE_SIZE = 500

const store = new Map<string, FeedItem>()

export function addItems(items: FeedItem[]): void {
  for (const item of items) {
    store.set(item.guid, item)
  }
  pruneExpired()
  capSize()
}

export function getItemsByCategory(category: Category, limit = 50): FeedItem[] {
  return Array.from(store.values())
    .filter(item => item.category === category)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, limit)
}

export function getAllItems(limit = 100): FeedItem[] {
  return Array.from(store.values())
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, limit)
}

export function getItemCount(): number {
  return store.size
}

export function getCategoryCounts(): Record<Category, number> {
  const counts: Record<Category, number> = { ai: 0, tech: 0, dev: 0, security: 0, cloud: 0, world: 0 }
  for (const item of store.values()) {
    counts[item.category]++
  }
  return counts
}

export function buildCycleFeed(): FeedItem[] {
  const seen = new Set<string>()
  const result: FeedItem[] = []

  for (const category of SLOT_ORDER) {
    const items = getItemsByCategory(category, STORIES_PER_SLOT * 3)
    let added = 0
    for (const item of items) {
      if (added >= STORIES_PER_SLOT) break
      if (!seen.has(item.guid)) {
        seen.add(item.guid)
        result.push(item)
        added++
      }
    }
  }

  return result
}

export function getWeekendItems(): FeedItem[] {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun, 1=Mon...
  const lastSunday = new Date(now)
  lastSunday.setDate(now.getDate() - dayOfWeek)
  lastSunday.setHours(23, 59, 59, 999)
  const lastFriday = new Date(lastSunday)
  lastFriday.setDate(lastSunday.getDate() - 2)
  lastFriday.setHours(0, 0, 0, 0)

  return Array.from(store.values())
    .filter(item => item.pubDate >= lastFriday && item.pubDate <= lastSunday)
    .sort((a, b) => {
      if (a.isCritical !== b.isCritical) return a.isCritical ? -1 : 1
      const s = (b.cvssScore ?? 0) - (a.cvssScore ?? 0)
      return s !== 0 ? s : b.pubDate.getTime() - a.pubDate.getTime()
    })
}

function pruneExpired(): void {
  const cutoff = Date.now() - MAX_AGE_MS
  for (const [guid, item] of store) {
    if (!isNaN(item.pubDate.getTime()) && item.pubDate.getTime() < cutoff) {
      store.delete(guid)
    }
  }
}

function capSize(): void {
  if (store.size <= MAX_STORE_SIZE) return
  const sorted = Array.from(store.entries()).sort(
    ([, a], [, b]) => a.pubDate.getTime() - b.pubDate.getTime()
  )
  const toDelete = sorted.slice(0, store.size - MAX_STORE_SIZE)
  for (const [guid] of toDelete) {
    store.delete(guid)
  }
}
