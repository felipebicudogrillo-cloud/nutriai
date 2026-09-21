import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTheme, getThemePreference } from './lib/theme'

// The inline script in index.html already applied the "dark" class before
// paint (avoids a flash of the wrong theme); this syncs the browser-chrome
// theme-color meta tag to match, which needs the DOM element to exist.
applyTheme(getThemePreference())

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
