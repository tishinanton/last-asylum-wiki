import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { AppProvider } from './state/AppContext'
import { ChecklistDataProvider } from './state/ChecklistDataContext'
import './styles.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Application root element was not found.')
}

createRoot(root).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ChecklistDataProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ChecklistDataProvider>
    </HashRouter>
  </StrictMode>,
)
