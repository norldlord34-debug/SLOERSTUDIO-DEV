import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0d14', color: '#fff', fontFamily: 'system-ui, sans-serif', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', maxWidth: '360px', textAlign: 'center' }}>SloerVoice Voice encountered an unexpected error. Click below to reload.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #63f3ff, #f6c15f)', color: '#0a0d14', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>Reload Application</button>
      </div>
    }>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
