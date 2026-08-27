export type Locale = 'ru' | 'en'

export interface LocalizedText {
  ru: string
  en: string
}

export type EventId = 'alliance-duel' | 'survival-battle'

export interface ChecklistTask {
  id: string
  eventId: EventId
  schedule?: string
  phaseId?: string
  themeId?: string
  label: LocalizedText
  overlapGroups?: string[]
  sourceIds: string[]
  confidence: 'high' | 'medium' | 'low'
  verificationIds?: string[]
  tutorial?: TutorialSlide[]
}

export interface TutorialSlide {
  id: string
  imageUrl: string
  description?: LocalizedText
}

export interface StockpileItem {
  id: string
  label: LocalizedText
  sourceIds: string[]
  confidence: 'high' | 'medium' | 'low'
  verificationIds?: string[]
}

export interface StockpilePlan {
  id: string
  targetPhaseId: string
  items: StockpileItem[]
}

export interface DailyPlaybookData {
  revision?: number
  schemaVersion: number
  dataAsOf: string
  actions: ChecklistTask[]
  stockpiles: StockpilePlan[]
}

export interface ChecklistSeed {
  schemaVersion: number
  dataAsOf: string
  events: {
    'alliance-duel': {
      resetTimeZone: string
      resetTimeZoneVerified: boolean
      activeIsoWeekdays: number[]
      phases: Array<{ isoWeekday: number; id: string }>
      sourceIds: string[]
    }
    'survival-battle': {
      resetTime: string
      resetTimeZone: string | null
      fallbackTimeZone: string
      resetTimeZoneVerified: boolean
      cycleAnchor: string | null
      cycleAnchorConfigurable: boolean
      roundDurationMinutes: number
      roundOffsetsMinutes: number[]
      cycle: Array<{ day: number; themes: string[] }>
      sourceIds: string[]
      verificationIds: string[]
    }
  }
  tasks: ChecklistTask[]
}

export interface Preferences {
  locale: Locale
  duelTimeZone: string
  duelResetTime: string
  survivalTimeZone: string
  survivalResetTime: string
  survivalCycleDay: number
  survivalCycleAnchor: string
}

export interface PersistedState {
  version: 2
  preferences: Preferences
  completions: Record<string, true>
}

export interface StorageIssue {
  code: 'read-failed' | 'invalid-data' | 'write-failed'
  message: string
}

export interface ScoreRow {
  action: LocalizedText
  points: string
  note?: LocalizedText
}

export interface ScoreTable {
  id: string
  title: LocalizedText
  rows: ScoreRow[]
  warning?: LocalizedText
}

export interface SourceRecord {
  id: string
  name: string
  url: string
  type: LocalizedText
  supports: LocalizedText
  confidence: 'high' | 'medium' | 'low'
}

export interface VerificationRecord {
  id: string
  priority: 'P0' | 'P1' | 'P2'
  claim: LocalizedText
  reason: LocalizedText
}
