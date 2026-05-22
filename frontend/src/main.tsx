import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
    setTimeout(() => window.location.reload(), 30_000)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090910',
          color: '#ef4444',
          fontFamily: 'monospace',
          gap: '16px',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.1em' }}>
            FEED OFFLINE
          </div>
          <div style={{ fontSize: '14px', color: '#8888a8' }}>
            Reloading in 30 seconds…
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
