import type { FeedItem } from './types.js'

const MAX_AGE_MS = 48 * 60 * 60 * 1000

const SPONSOR_TITLE_PATTERNS = [
  /\[sponsored\]/i,
  /\(sponsored\)/i,
  /\[ad\]/i,
  /sponsored by/i,
  /brought to you by/i,
  /in partnership with/i,
  /presented by/i,
]

const SPONSOR_KEYWORDS = [
  'advertisement',
  'advertise with us',
  'promote your product',
  'this week\'s sponsor',
  'our sponsor',
  'partner content',
  'promo code',
  'discount code',
  'coupon',
]

const DEVTO_ALLOWED_TAGS = new Set([
  'javascript', 'typescript', 'react', 'node', 'python', 'webdev',
  'devops', 'docker', 'kubernetes', 'programming', 'opensource',
  'ai', 'ml', 'machinelearning', 'security', 'rust', 'go',
])

export function ageFilter(item: FeedItem): boolean {
  const age = Date.now() - item.pubDate.getTime()
  return isNaN(item.pubDate.getTime()) || age <= MAX_AGE_MS
}

export function sponsorFilter(item: FeedItem): boolean {
  const title = item.title || ''
  const body = item.description || ''
  const full = `${title} ${body}`.toLowerCase()

  if (SPONSOR_TITLE_PATTERNS.some(re => re.test(title))) return false
  if (SPONSOR_KEYWORDS.some(kw => full.includes(kw))) return false
  return true
}

export function devtoFilter(item: FeedItem, tags: string[]): boolean {
  if (item.source !== 'Dev.to') return true
  return tags.some(t => DEVTO_ALLOWED_TAGS.has(t.toLowerCase()))
}

export function cvssFilter(item: FeedItem): boolean {
  if (item.cvssScore === undefined) return true
  return item.cvssScore >= 7.0
}

export function extractCvss(title: string, description: string): { score: number; cveId: string } | null {
  const text = `${title} ${description}`

  const cveMatch = text.match(/CVE-\d{4}-\d{4,7}/i)
  const cveId = cveMatch ? cveMatch[0].toUpperCase() : ''

  const scoreMatch =
    text.match(/cvss[v3]*\s*(?:score|base\s*score)?[:\s]+(\d+\.?\d*)/i) ||
    text.match(/score[:\s]+(\d+\.?\d*)/i)

  if (!scoreMatch && !cveId) return null

  let score: number
  if (scoreMatch) {
    score = parseFloat(scoreMatch[1])
  } else if (/critical/i.test(title)) {
    score = 9.0
  } else if (/high/i.test(title)) {
    score = 7.5
  } else {
    score = 7.0
  }

  return { score, cveId }
}

const WORLD_ALLOW = [
  'election', 'government', 'sanctions', 'war', 'conflict', 'treaty', 'summit',
  'economy', 'inflation', 'recession', 'market', 'gdp', 'bank', 'interest rate',
  'regulation', 'antitrust', 'data', 'privacy', 'surveillance', 'censorship',
  'semiconductor', 'chip', 'supply chain', 'undersea cable', 'satellite',
  'nuclear', 'energy', 'climate', 'disaster', 'earthquake', 'hurricane',
  'openai', 'google', 'microsoft', 'apple', 'amazon', 'meta', 'nvidia',
  'elon musk', 'sam altman', 'spacex', 'tesla',
]

const WORLD_BLOCK = [
  'celebrity', 'sport', 'football', 'cricket', 'rugby', 'tennis', 'golf',
  'music', 'film', 'tv show', 'royal family', 'wedding', 'divorce',
  'trial', 'murder', 'shooting', 'stabbing', 'missing', 'accident',
]

export function worldFilter(item: FeedItem): boolean {
  if (item.category !== 'world') return true
  const text = `${item.title} ${item.description}`.toLowerCase()
  if (WORLD_BLOCK.some(t => text.includes(t))) return false
  return WORLD_ALLOW.some(t => text.includes(t))
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
