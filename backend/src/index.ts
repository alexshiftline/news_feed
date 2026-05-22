import express from 'express'
import cors from 'cors'
import { startPolling } from './poller.js'
import { buildCycleFeed, getAllItems, getItemCount, getCategoryCounts, getWeekendItems } from './store.js'
import { getWeather } from './weatherService.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.use(cors({
  origin: [
    'http://localhost:7474',
    'http://localhost:4173',
    'https://starcraft-dev.ngrok.app',
  ],
}))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    itemCount: getItemCount(),
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/feed', (_req, res) => {
  const items = buildCycleFeed()
  res.json({
    items,
    totalCount: getItemCount(),
    fetchedAt: new Date().toISOString(),
    categories: getCategoryCounts(),
  })
})

app.get('/api/feed/all', (_req, res) => {
  res.json({
    items: getAllItems(200),
    totalCount: getItemCount(),
    fetchedAt: new Date().toISOString(),
  })
})

app.get('/api/feed/weekend-catchup', (_req, res) => {
  res.json({
    items: getWeekendItems(),
    fetchedAt: new Date().toISOString(),
  })
})

app.get('/api/weather', async (_req, res) => {
  const weather = await getWeather()
  if (!weather) {
    res.status(503).json({ error: 'weather unavailable' })
    return
  }
  res.json(weather)
})

startPolling()

getWeather().catch((err: unknown) =>
  console.warn('[startup] weather pre-fetch failed:', (err as Error).message)
)

app.listen(PORT, () => {
  console.log(`[server] Tech News Board backend listening on http://localhost:${PORT}`)
})
