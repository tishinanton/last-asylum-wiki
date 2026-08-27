import { createContext, useContext } from 'react'
import type { DailyPlaybookData } from '../types'

export interface ChecklistDataContextValue {
  data: DailyPlaybookData
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  replaceData: (data: DailyPlaybookData) => void
}

export const ChecklistDataContext = createContext<ChecklistDataContextValue | null>(null)

export function useChecklistData(): ChecklistDataContextValue {
  const context = useContext(ChecklistDataContext)
  if (!context) {
    throw new Error('useChecklistData must be used inside ChecklistDataProvider.')
  }
  return context
}
