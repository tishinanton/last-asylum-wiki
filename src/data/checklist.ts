import seedJson from '../../docs/research/checklist-data.json'
import type { ChecklistSeed, ChecklistTask, EventId, LocalizedText } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.ru === 'string' && typeof value.en === 'string'
}

function isEventId(value: unknown): value is EventId {
  return value === 'alliance-duel' || value === 'survival-battle'
}

function isChecklistTask(value: unknown): value is ChecklistTask {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isEventId(value.eventId) &&
    isLocalizedText(value.label) &&
    Array.isArray(value.sourceIds) &&
    value.sourceIds.every((item) => typeof item === 'string') &&
    (value.confidence === 'high' || value.confidence === 'medium' || value.confidence === 'low')
  )
}

function isChecklistSeed(value: unknown): value is ChecklistSeed {
  if (!isRecord(value) || !isRecord(value.events)) return false
  const duel = value.events['alliance-duel']
  const survival = value.events['survival-battle']
  return (
    typeof value.schemaVersion === 'number' &&
    typeof value.dataAsOf === 'string' &&
    isRecord(duel) &&
    typeof duel.resetTimeZone === 'string' &&
    Array.isArray(duel.phases) &&
    isRecord(survival) &&
    typeof survival.roundDurationMinutes === 'number' &&
    Array.isArray(survival.cycle) &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isChecklistTask)
  )
}

function parseSeed(value: unknown): ChecklistSeed {
  if (!isChecklistSeed(value)) {
    throw new Error('Research checklist data does not match the expected schema.')
  }
  return value
}

export const checklistSeed = parseSeed(seedJson)

export const phaseNames: Record<string, LocalizedText> = {
  'AD-D1-RAVEN': { ru: 'Ворон', en: 'Raven' },
  'AD-D2-CONSTRUCTION': { ru: 'Строительство', en: 'Construction' },
  'AD-D3-TECH': { ru: 'Технологии', en: 'Tech' },
  'AD-D4-HERO': { ru: 'Герои', en: 'Hero' },
  'AD-D5-PREPARATION': { ru: 'Подготовка', en: 'Preparation' },
  'AD-D6-RAID': { ru: 'Рейд', en: 'Raid' },
  'AD-PREP-SUNDAY': { ru: 'Воскресная подготовка', en: 'Sunday preparation' },
}

export const themeNames: Record<string, LocalizedText> = {
  'SB-BUILD': { ru: 'Строительство территории', en: 'Build Territory' },
  'SB-TRAIN': { ru: 'Тренировка солдат', en: 'Train Soldiers' },
  'SB-RESEARCH': { ru: 'Исследование технологий', en: 'Technology Research' },
  'SB-RAVEN': { ru: 'Усиление Ворона', en: 'Enhance Raven' },
  'SB-HEROES': { ru: 'Усиление героев', en: 'Enhance Heroes' },
}

export const themeOverlapGroups: Record<string, string[]> = {
  'SB-BUILD': ['construction-speedup', 'building-might'],
  'SB-TRAIN': ['training-speedup', 'soldier-training'],
  'SB-RESEARCH': ['research-speedup', 'tech-might'],
  'SB-RAVEN': ['stamina', 'raven-fruit'],
  'SB-HEROES': ['hero-recruit', 'antitoxin'],
}
