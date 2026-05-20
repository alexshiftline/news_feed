export type Category = 'ai' | 'tech' | 'dev' | 'security' | 'cloud' | 'world'

export interface FeedItem {
  guid: string
  title: string
  link: string
  description: string
  pubDate: Date
  source: string
  category: Category
  cvssScore?: number
  cveId?: string
  isCritical?: boolean
}

export interface FeedConfig {
  name: string
  url: string
  category: Category
  pollInterval: number
  tags?: string[]
  isCveFeed?: boolean
}

export interface WeatherCurrent {
  tempC: number
  feelsLikeC: number
  humidity: number
  windKph: number
  windDir: string
  wmoCode: number
  icon: string
  description: string
  isDay: boolean
}

export interface WeatherDay {
  date: string
  maxC: number
  minC: number
  wmoCode: number
  icon: string
  precipMm: number
  precipPct: number
}

export interface WeatherData {
  current: WeatherCurrent
  forecast: WeatherDay[]
  fetchedAt: Date
}

export interface FeedResponse {
  items: FeedItem[]
  totalCount: number
  fetchedAt: string
  categories: Record<Category, number>
}
