import { useEffect, useRef, useState } from 'react'
import type { WeatherData } from '../types'

interface WeatherState {
  weather: WeatherData | null
  error: boolean
}

const POLL_INTERVAL = 30 * 60_000

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ weather: null, error: false })
  const lastGood = useRef<WeatherData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: WeatherData = await res.json()
        if (cancelled) return
        lastGood.current = data
        setState({ weather: data, error: false })
      } catch {
        if (cancelled) return
        setState({ weather: lastGood.current, error: true })
      }
    }

    fetchWeather()
    const timer = setInterval(fetchWeather, POLL_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return state
}
