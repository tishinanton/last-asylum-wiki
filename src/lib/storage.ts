import type { PersistedState, Preferences, StorageIssue } from '../types'

export const STORAGE_KEY = 'last-asylum:field-node'

export const DEFAULT_PREFERENCES: Preferences = {
  locale: 'ru',
  duelTimeZone: 'UTC',
  duelResetTime: '00:00:00',
  survivalTimeZone: 'UTC',
  survivalResetTime: '00:00:00',
  survivalCycleDay: 1,
  survivalCycleAnchor: '',
}

export const DEFAULT_STATE: PersistedState = {
  version: 2,
  preferences: DEFAULT_PREFERENCES,
  completions: {},
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface LoadStateResult {
  state: PersistedState
  issue: StorageIssue | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePreferences(value: unknown): Preferences {
  if (!isRecord(value)) return DEFAULT_PREFERENCES
  const locale = value.locale === 'en' ? 'en' : 'ru'
  return {
    locale,
    duelTimeZone: typeof value.duelTimeZone === 'string' ? value.duelTimeZone : 'UTC',
    duelResetTime: typeof value.duelResetTime === 'string' ? value.duelResetTime : '00:00:00',
    survivalTimeZone: typeof value.survivalTimeZone === 'string' ? value.survivalTimeZone : 'UTC',
    survivalResetTime: typeof value.survivalResetTime === 'string' ? value.survivalResetTime : '00:00:00',
    survivalCycleDay:
      typeof value.survivalCycleDay === 'number' && value.survivalCycleDay >= 1 && value.survivalCycleDay <= 7
        ? value.survivalCycleDay
        : 1,
    survivalCycleAnchor: typeof value.survivalCycleAnchor === 'string' ? value.survivalCycleAnchor : '',
  }
}

function parseCompletions(value: unknown): Record<string, true> {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.filter((item): item is string => typeof item === 'string').map((item) => [item, true]))
  }
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, true] => entry[1] === true)
      .map(([key]) => [key, true]),
  )
}

export function migrateState(value: unknown): PersistedState | null {
  if (!isRecord(value)) return null
  if (value.version === 2) {
    return {
      version: 2,
      preferences: parsePreferences(value.preferences),
      completions: parseCompletions(value.completions),
    }
  }
  if (value.version === 1) {
    return {
      version: 2,
      preferences: parsePreferences(value.settings ?? value.preferences),
      completions: parseCompletions(value.completed ?? value.completions),
    }
  }
  return null
}

export function loadState(storage: StorageLike): LoadStateResult {
  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return {
      state: DEFAULT_STATE,
      issue: { code: 'read-failed', message: 'Browser storage could not be read.' },
    }
  }
  if (!raw) return { state: DEFAULT_STATE, issue: null }

  try {
    const migrated = migrateState(JSON.parse(raw))
    if (!migrated) {
      return {
        state: DEFAULT_STATE,
        issue: { code: 'invalid-data', message: 'Saved data used an unsupported format.' },
      }
    }
    return { state: migrated, issue: null }
  } catch {
    return {
      state: DEFAULT_STATE,
      issue: { code: 'invalid-data', message: 'Saved data was damaged and could not be restored.' },
    }
  }
}

export function saveState(storage: StorageLike, state: PersistedState): StorageIssue | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return null
  } catch {
    return { code: 'write-failed', message: 'Browser storage could not be updated.' }
  }
}
