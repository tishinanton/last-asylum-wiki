import { describe, expect, it } from 'vitest'
import { checklistSeed } from '../data/checklist'
import {
  formatCountdown,
  getAlliancePhase,
  getCurrentCycleDay,
  getCycleKey,
  getNextReset,
  getSurvivalRounds,
} from './time'

describe('event time calculations', () => {
  it('uses the previous cycle before a configured reset', () => {
    const now = new Date('2026-08-27T01:30:00Z')
    expect(getCycleKey(now, 'UTC', '02:00:00')).toBe('2026-08-26')
    expect(getCycleKey(now, 'UTC', '00:00:00')).toBe('2026-08-27')
  })

  it('finds the next reset boundary', () => {
    const now = new Date('2026-08-27T17:45:00Z')
    expect(getNextReset(now, 'UTC', '00:00:00').toISOString()).toBe('2026-08-28T00:00:00.000Z')
  })

  it('maps Alliance Duel weekdays and reserves Sunday for preparation', () => {
    const phases = checklistSeed.events['alliance-duel'].phases
    expect(getAlliancePhase(new Date('2026-08-26T12:00:00Z'), 'UTC', '00:00:00', phases)).toBe('AD-D3-TECH')
    expect(getAlliancePhase(new Date('2026-08-30T12:00:00Z'), 'UTC', '00:00:00', phases)).toBe('AD-PREP-SUNDAY')
  })

  it('calculates a seven-day cycle only when an anchor exists', () => {
    expect(getCurrentCycleDay('2026-08-27', '', 6)).toBe(6)
    expect(getCurrentCycleDay('2026-08-27', '2026-08-24', 1)).toBe(4)
    expect(getCurrentCycleDay('2026-08-23', '2026-08-24', 1)).toBe(7)
  })

  it('identifies current and next four-hour Survival Battle rounds', () => {
    const rounds = getSurvivalRounds(
      new Date('2026-08-27T12:30:00Z'),
      'UTC',
      '00:00:00',
      1,
      checklistSeed.events['survival-battle'].cycle,
      240,
    )
    expect(rounds).toHaveLength(6)
    expect(rounds[3]).toMatchObject({ themeId: 'SB-RAVEN', status: 'current' })
    expect(rounds[4]).toMatchObject({ themeId: 'SB-HEROES', status: 'upcoming' })
  })

  it('formats countdowns without negative values', () => {
    expect(formatCountdown(3_661_000)).toBe('01:01:01')
    expect(formatCountdown(-1)).toBe('00:00:00')
  })
})
