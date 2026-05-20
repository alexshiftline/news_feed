import type { WeatherCurrent, WeatherData, WeatherDay } from './types.js'

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=-33.9249' +
  '&longitude=18.4241' +
  '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day' +
  '&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,precipitation_probability_max' +
  '&timezone=Africa%2FJohannesburg' +
  '&forecast_days=3' +
  '&wind_speed_unit=kmh'

const CACHE_TTL = 30 * 60 * 1000

const WMO_MAP: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',        icon: '☀️' },
  1:  { label: 'Mainly clear',     icon: '🌤️' },
  2:  { label: 'Partly cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Fog',              icon: '🌫️' },
  48: { label: 'Icy fog',          icon: '🌫️' },
  51: { label: 'Light drizzle',    icon: '🌦️' },
  53: { label: 'Drizzle',          icon: '🌦️' },
  55: { label: 'Heavy drizzle',    icon: '🌦️' },
  61: { label: 'Light rain',       icon: '🌧️' },
  63: { label: 'Moderate rain',    icon: '🌧️' },
  65: { label: 'Heavy rain',       icon: '🌧️' },
  71: { label: 'Light snow',       icon: '❄️' },
  73: { label: 'Moderate snow',    icon: '❄️' },
  75: { label: 'Heavy snow',       icon: '❄️' },
  80: { label: 'Rain showers',     icon: '🌦️' },
  81: { label: 'Rain showers',     icon: '🌦️' },
  82: { label: 'Violent showers',  icon: '🌧️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
  96: { label: 'Thunderstorm',     icon: '⛈️' },
  99: { label: 'Thunderstorm',     icon: '⛈️' },
}

const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

interface Cache {
  data: WeatherData
  fetchedAt: number
}

let cache: Cache | null = null

function wmoToIcon(code: number): string {
  return WMO_MAP[code]?.icon ?? '🌡️'
}

function wmoToDescription(code: number): string {
  return WMO_MAP[code]?.label ?? 'Unknown'
}

function windDegToCardinal(deg: number): string {
  return CARDINAL[Math.round(deg / 45) % 8]
}

function shortDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-ZA', { weekday: 'short' })
}

async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch(OPEN_METEO_URL, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

  const data = await res.json() as {
    current: {
      temperature_2m: number
      apparent_temperature: number
      relative_humidity_2m: number
      wind_speed_10m: number
      wind_direction_10m: number
      weather_code: number
      is_day: number
    }
    daily: {
      time: string[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      weather_code: number[]
      precipitation_sum: number[]
      wind_speed_10m_max: number[]
      precipitation_probability_max: number[]
    }
  }

  const c = data.current
  const current: WeatherCurrent = {
    tempC: Math.round(c.temperature_2m),
    feelsLikeC: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windKph: Math.round(c.wind_speed_10m),
    windDir: windDegToCardinal(c.wind_direction_10m),
    wmoCode: c.weather_code,
    icon: wmoToIcon(c.weather_code),
    description: wmoToDescription(c.weather_code),
    isDay: c.is_day === 1,
  }

  const d = data.daily
  const forecast: WeatherDay[] = d.time.map((date, i) => ({
    date: shortDayName(date),
    maxC: Math.round(d.temperature_2m_max[i]),
    minC: Math.round(d.temperature_2m_min[i]),
    wmoCode: d.weather_code[i],
    icon: wmoToIcon(d.weather_code[i]),
    precipMm: Math.round(d.precipitation_sum[i] * 10) / 10,
    precipPct: d.precipitation_probability_max[i],
  }))

  return { current, forecast, fetchedAt: new Date() }
}

export async function getWeather(): Promise<WeatherData | null> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return cache.data
  }
  try {
    const data = await fetchWeather()
    cache = { data, fetchedAt: Date.now() }
    return data
  } catch (err) {
    console.warn('[weather] fetch failed:', (err as Error).message)
    return cache?.data ?? null
  }
}
