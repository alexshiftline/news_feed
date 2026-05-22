import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7474,
    host: '0.0.0.0',
    allowedHosts: ['starcraft-dev.ngrok.app'],
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:7473',
        changeOrigin: true,
      },
    },
  },
})
