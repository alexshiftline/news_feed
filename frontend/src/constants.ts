import type { Category } from './types'

export const CATEGORY_ORDER: Category[] = ['security', 'ai', 'dev', 'tech', 'cloud', 'world']

export const CATEGORY_LABELS: Record<Category, string> = {
  security: 'SECURITY',
  ai: 'AI',
  dev: 'DEV',
  tech: 'TECH',
  cloud: 'CLOUD',
  world: 'WORLD',
}

export const CATEGORY_ICONS: Record<Category | 'all', string> = {
  all: '⚡',
  security: '🔒',
  ai: '🤖',
  dev: '⚙',
  tech: '💡',
  cloud: '☁',
  world: '🌍',
}
