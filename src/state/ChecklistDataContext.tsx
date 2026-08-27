import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dailyPlaybook, parseDailyPlaybook } from '../data/daily-playbook'
import type { DailyPlaybookData } from '../types'
import {
  ChecklistDataContext,
  type ChecklistDataContextValue,
} from './checklist-data-context'

export function ChecklistDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DailyPlaybookData>(dailyPlaybook)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checklist', {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Checklist request failed with status ${response.status}.`)
      }
      setData(parseDailyPlaybook(await response.json()))
      setError(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Checklist data could not be loaded.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const value = useMemo<ChecklistDataContextValue>(
    () => ({
      data,
      loading,
      error,
      reload,
      replaceData: (nextData) => {
        setData(nextData)
        setError(null)
      },
    }),
    [data, error, loading, reload],
  )

  return (
    <ChecklistDataContext.Provider value={value}>
      {children}
    </ChecklistDataContext.Provider>
  )
}
