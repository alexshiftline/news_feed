export type Category = 'ai' | 'tech' | 'dev' | 'security' | 'cloud' | 'world'

export interface FeedItem {
  guid: string
  title: string
  link: string
  description: string
  pubDate: string
  source: string
  category: Category
  cvssScore?: number
  cveId?: string
  isCritical?: boolean
}

export interface FeedResponse {
  items: FeedItem[]
  totalCount: number
  fetchedAt: string
}

export interface WeekendCatchupResponse {
  items: FeedItem[]
  fetchedAt: string
}
