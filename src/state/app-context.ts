import { createContext, useContext } from 'react'
import type { PersistedState, Preferences, StorageIssue } from '../types'

export interface AppContextValue {
  state: PersistedState
  now: Date
  storageIssue: StorageIssue | null
  setLocale: (locale: Preferences['locale']) => void
  updatePreferences: (preferences: Partial<Preferences>) => void
  isComplete: (eventId: string, cycleKey: string, taskId: string) => boolean
  toggleComplete: (eventId: string, cycleKey: string, taskId: string) => void
  clearCycle: (eventCycleKeys: Array<{ eventId: string; cycleKey: string }>) => void
  clearAll: () => void
  resetPreferences: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider.')
  }
  return context
}
