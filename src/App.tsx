import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AllianceDuelPage } from './pages/AllianceDuelPage'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'
import { SourcesPage } from './pages/SourcesPage'
import { SurvivalBattlePage } from './pages/SurvivalBattlePage'
import { TodayPage } from './pages/TodayPage'
import { WeeklyPlanPage } from './pages/WeeklyPlanPage'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return null
}

export function App() {
  return (
    <AppShell>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/alliance-duel" element={<AllianceDuelPage />} />
        <Route path="/survival-battle" element={<SurvivalBattlePage />} />
        <Route path="/weekly-plan" element={<WeeklyPlanPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  )
}
