import type { ChecklistSeed } from '../types'

export interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  isoWeekday: number
}

export interface SurvivalRound {
  index: number
  themeId: string
  startMinutes: number
  endMinutes: number
  status: 'past' | 'current' | 'upcoming'
}

function numericPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  return Number(parts.find((part) => part.type === type)?.value ?? 0)
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const parts = formatter.formatToParts(date)
  const year = numericPart(parts, 'year')
  const month = numericPart(parts, 'month')
  const day = numericPart(parts, 'day')
  const utcDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay()

  return {
    year,
    month,
    day,
    hour: numericPart(parts, 'hour'),
    minute: numericPart(parts, 'minute'),
    second: numericPart(parts, 'second'),
    isoWeekday: utcDay === 0 ? 7 : utcDay,
  }
}

function parseResetTime(resetTime: string): { hour: number; minute: number; second: number } {
  const [hour = 0, minute = 0, second = 0] = resetTime.split(':').map(Number)
  return { hour, minute, second }
}

function dateKey(year: number, month: number, day: number): string {
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

function shiftCalendarDate(parts: Pick<ZonedParts, 'year' | 'month' | 'day'>, days: number) {
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days))
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  }
}

export function getCycleKey(date: Date, timeZone: string, resetTime: string): string {
  const parts = getZonedParts(date, timeZone)
  const reset = parseResetTime(resetTime)
  const currentSeconds = parts.hour * 3600 + parts.minute * 60 + parts.second
  const resetSeconds = reset.hour * 3600 + reset.minute * 60 + reset.second
  const cycleDate = currentSeconds < resetSeconds ? shiftCalendarDate(parts, -1) : parts
  return dateKey(cycleDate.year, cycleDate.month, cycleDate.day)
}

function getTimeZoneOffsetMilliseconds(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone)
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  return representedAsUtc - Math.floor(date.getTime() / 1000) * 1000
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): Date {
  const initial = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  const firstOffset = getTimeZoneOffsetMilliseconds(initial, timeZone)
  const adjusted = new Date(initial.getTime() - firstOffset)
  const secondOffset = getTimeZoneOffsetMilliseconds(adjusted, timeZone)
  return new Date(initial.getTime() - secondOffset)
}

export function getNextReset(date: Date, timeZone: string, resetTime: string): Date {
  const parts = getZonedParts(date, timeZone)
  const reset = parseResetTime(resetTime)
  const currentSeconds = parts.hour * 3600 + parts.minute * 60 + parts.second
  const resetSeconds = reset.hour * 3600 + reset.minute * 60 + reset.second
  const targetDate = currentSeconds < resetSeconds ? parts : shiftCalendarDate(parts, 1)
  return zonedDateTimeToUtc(
    targetDate.year,
    targetDate.month,
    targetDate.day,
    reset.hour,
    reset.minute,
    reset.second,
    timeZone,
  )
}

export function getAlliancePhase(
  date: Date,
  timeZone: string,
  resetTime: string,
  phases: ChecklistSeed['events']['alliance-duel']['phases'],
): string {
  const cycleKey = getCycleKey(date, timeZone, resetTime)
  const [year, month, day] = cycleKey.split('-').map(Number)
  const weekDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  const isoWeekday = weekDay === 0 ? 7 : weekDay
  return phases.find((phase) => phase.isoWeekday === isoWeekday)?.id ?? 'AD-PREP-SUNDAY'
}

export function getCurrentCycleDay(cycleKey: string, anchor: string, manualDay: number): number {
  if (!anchor) return manualDay
  const current = Date.parse(`${cycleKey}T00:00:00Z`)
  const start = Date.parse(`${anchor}T00:00:00Z`)
  if (!Number.isFinite(current) || !Number.isFinite(start)) return manualDay
  const elapsedDays = Math.floor((current - start) / 86_400_000)
  return ((elapsedDays % 7) + 7) % 7 + 1
}

export function getSurvivalRounds(
  date: Date,
  timeZone: string,
  resetTime: string,
  cycleDay: number,
  cycle: ChecklistSeed['events']['survival-battle']['cycle'],
  durationMinutes: number,
): SurvivalRound[] {
  const parts = getZonedParts(date, timeZone)
  const reset = parseResetTime(resetTime)
  const resetMinutes = reset.hour * 60 + reset.minute
  const wallMinutes = parts.hour * 60 + parts.minute
  const elapsed = (wallMinutes - resetMinutes + 1440) % 1440
  const themes = cycle.find((entry) => entry.day === cycleDay)?.themes ?? []
  const currentIndex = Math.min(Math.floor(elapsed / durationMinutes), themes.length - 1)

  return themes.map((themeId, index) => ({
    index,
    themeId,
    startMinutes: (resetMinutes + index * durationMinutes) % 1440,
    endMinutes: (resetMinutes + (index + 1) * durationMinutes) % 1440,
    status: index < currentIndex ? 'past' : index === currentIndex ? 'current' : 'upcoming',
  }))
}

export function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':')
}

export function formatClockMinutes(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  return `${Math.floor(normalized / 60).toString().padStart(2, '0')}:${(normalized % 60).toString().padStart(2, '0')}`
}
