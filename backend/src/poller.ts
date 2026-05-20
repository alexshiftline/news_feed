import Parser from 'rss-parser'
import cron from 'node-cron'
import { createHash } from 'crypto'
import { FEEDS } from './config/feeds.js'
import { ageFilter, sponsorFilter, devtoFilter, cvssFilter, worldFilter, extractCvss, stripHtml } from './filters.js'
import { addItems } from './store.js'
import type { FeedConfig, FeedItem } from './types.js'

type RssItem = {
  guid?: string
  id?: string
  link?: string
  title?: string
  pubDate?: string
  isoDate?: string
  contentSnippet?: string
  content?: string
  'content:encoded'?: string
  description?: string
  categories?: string[]
}

const parser = new Parser<Record<string, unknown>, RssItem>({
  customFields: {
    item: [['content:encoded', 'content:encoded'], ['category', 'category']] as never,
  },
  timeout: 10_000,
  headers: {
    'User-Agent': 'TechNewsBoard/1.0 (RSS Aggregator; contact tech@shiftline.ai)',
    Accept: 'application/rss+xml,application/xml,text/xml,*/*',
  },
})

function makeGuid(item: RssItem, config: FeedConfig): string {
  if (item.guid) return item.guid
  if (item.id) return item.id
  if (item.link) return item.link
  const raw = (item.title ?? '') + (item.link ?? '') + config.name
  return createHash('sha256').update(raw).digest('hex').slice(0, 16)
}

async function parseFeed(config: FeedConfig): Promise<FeedItem[]> {
  const feed = await parser.parseURL(config.url)
  const items: FeedItem[] = []

  for (const raw of feed.items) {
    const rawDesc = (raw as Record<string, unknown>)['content:encoded'] as string | undefined
      || raw.content
      || raw.contentSnippet
      || raw.description
      || ''

    const description = stripHtml(rawDesc).slice(0, 400)

    const pubDate = new Date(raw.isoDate ?? raw.pubDate ?? Date.now())

    const item: FeedItem = {
      guid: makeGuid(raw, config),
      title: (raw.title ?? 'Untitled').trim(),
      link: raw.link ?? '',
      description,
      pubDate,
      source: config.name,
      category: config.category,
    }

    if (config.isCveFeed) {
      const cvss = extractCvss(item.title, item.description)
      if (cvss) {
        item.cvssScore = cvss.score
        item.cveId = cvss.cveId
        item.isCritical = cvss.score >= 9.0
      }
    }

    const tags = raw.categories ?? []
    const passes =
      ageFilter(item) &&
      sponsorFilter(item) &&
      devtoFilter(item, tags) &&
      cvssFilter(item) &&
      worldFilter(item)

    if (passes) items.push(item)
  }

  return items
}

function scheduleFeed(config: FeedConfig): void {
  const expression = `*/${config.pollInterval} * * * *`

  const poll = async () => {
    try {
      const items = await parseFeed(config)
      if (items.length > 0) addItems(items)
    } catch (err) {
      console.warn(`[poller] ${config.name} failed:`, (err as Error).message)
    }
  }

  poll()
  cron.schedule(expression, poll)
}

export function startPolling(): void {
  console.log(`[poller] Scheduling ${FEEDS.length} feeds`)
  for (const feed of FEEDS) {
    scheduleFeed(feed)
  }
}
