import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// iOS Safari (and some other mobile browsers) can restore a frozen snapshot
// of the page from the back-forward cache when the user switches apps and
// comes back, instead of resuming the live JS — the UI then looks stuck
// until a manual reload. Force a real reload whenever that happens so state
// is always fresh.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
