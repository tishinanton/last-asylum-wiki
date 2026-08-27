import playbookJson from '../../docs/research/daily-playbook.json'
import type {
  ChecklistTask,
  DailyPlaybookData,
  EventId,
  LocalizedText,
  StockpileItem,
  StockpilePlan,
} from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.ru === 'string' && typeof value.en === 'string'
}

function isEventId(value: unknown): value is EventId {
  return value === 'alliance-duel' || value === 'survival-battle'
}

function isConfidence(value: unknown): value is ChecklistTask['confidence'] {
  return value === 'high' || value === 'medium' || value === 'low'
}

function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isAction(value: unknown): value is ChecklistTask {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isEventId(value.eventId) &&
    (value.phaseId === undefined || typeof value.phaseId === 'string') &&
    (value.themeId === undefined || typeof value.themeId === 'string') &&
    isLocalizedText(value.label) &&
    hasStringArray(value.sourceIds) &&
    isConfidence(value.confidence) &&
    (value.overlapGroups === undefined || hasStringArray(value.overlapGroups)) &&
    (value.verificationIds === undefined || hasStringArray(value.verificationIds))
  )
}

function isStockpileItem(value: unknown): value is StockpileItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isLocalizedText(value.label) &&
    hasStringArray(value.sourceIds) &&
    isConfidence(value.confidence) &&
    (value.verificationIds === undefined || hasStringArray(value.verificationIds))
  )
}

function isStockpilePlan(value: unknown): value is StockpilePlan {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.targetPhaseId === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isStockpileItem)
  )
}

function isDailyPlaybookData(value: unknown): value is DailyPlaybookData {
  if (!isRecord(value)) return false
  return (
    (value.revision === undefined || typeof value.revision === 'number') &&
    typeof value.schemaVersion === 'number' &&
    typeof value.dataAsOf === 'string' &&
    Array.isArray(value.actions) &&
    value.actions.every(isAction) &&
    Array.isArray(value.stockpiles) &&
    value.stockpiles.every(isStockpilePlan)
  )
}

export function parseDailyPlaybook(value: unknown): DailyPlaybookData {
  if (!isDailyPlaybookData(value)) {
    throw new Error('Daily playbook data does not match the expected schema.')
  }
  return value
}

export const dailyPlaybook = parseDailyPlaybook(playbookJson)
