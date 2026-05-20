import type { Category } from '../types.js'

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  security: 4,
  ai: 3,
  dev: 2,
  tech: 2,
  cloud: 1,
  world: 1,
}

export const SLOT_ORDER: Category[] = [
  'security', 'security', 'security', 'security',
  'ai', 'ai', 'ai',
  'dev', 'dev',
  'tech', 'tech',
  'cloud',
  'world',
]

export const STORIES_PER_SLOT = 7
export const STORY_DURATION_MS = 15_000
