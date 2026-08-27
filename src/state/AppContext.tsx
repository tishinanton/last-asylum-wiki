import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { PersistedState, Preferences, StorageIssue } from '../types'
import {
  DEFAULT_PREFERENCES,
  DEFAULT_STATE,
  loadState,
  saveState,
  STORAGE_KEY,
} from '../lib/storage'
import { AppContext, type AppContextValue } from './app-context'

function completionKey(eventId: string, cycleKey: string, taskId: string): string {
  return `${eventId}:${cycleKey}:${taskId}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadState(window.localStorage), [])
  const [state, setState] = useState<PersistedState>(initial.state)
  const [storageIssue, setStorageIssue] = useState<StorageIssue | null>(initial.issue)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = state.preferences.locale
  }, [state.preferences.locale])

  const commit = (next: PersistedState) => {
    setState(next)
    setStorageIssue(saveState(window.localStorage, next))
  }

  const updatePreferences = (preferences: Partial<Preferences>) => {
    commit({
      ...state,
      preferences: { ...state.preferences, ...preferences },
    })
  }

  const toggleComplete = (eventId: string, cycleKey: string, taskId: string) => {
    const key = completionKey(eventId, cycleKey, taskId)
    const completions = { ...state.completions }
    if (completions[key]) {
      delete completions[key]
    } else {
      completions[key] = true
    }
    commit({ ...state, completions })
  }

  const clearCycle = (eventCycleKeys: Array<{ eventId: string; cycleKey: string }>) => {
    const prefixes = eventCycleKeys.map(({ eventId, cycleKey }) => `${eventId}:${cycleKey}:`)
    const completions = Object.fromEntries(
      Object.entries(state.completions).filter(([key]) => !prefixes.some((prefix) => key.startsWith(prefix))),
    )
    commit({ ...state, completions })
  }

  const clearAll = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      setState(DEFAULT_STATE)
      setStorageIssue(null)
    } catch {
      setState(DEFAULT_STATE)
      setStorageIssue({ code: 'write-failed', message: 'Browser storage could not be cleared.' })
    }
  }

  const value: AppContextValue = {
    state,
    now,
    storageIssue,
    setLocale: (locale) => updatePreferences({ locale }),
    updatePreferences,
    isComplete: (eventId, cycleKey, taskId) =>
      Boolean(state.completions[completionKey(eventId, cycleKey, taskId)]),
    toggleComplete,
    clearCycle,
    clearAll,
    resetPreferences: () => updatePreferences(DEFAULT_PREFERENCES),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
