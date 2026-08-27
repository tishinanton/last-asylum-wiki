import { describe, expect, it } from 'vitest'
import { dailyPlaybook } from './daily-playbook'

describe('daily playbook data', () => {
  it('keeps every action and reserve identifier unique', () => {
    const ids = [
      ...dailyPlaybook.actions.map((action) => action.id),
      ...dailyPlaybook.stockpiles.flatMap((plan) => [
        plan.id,
        ...plan.items.map((item) => item.id),
      ]),
    ]

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('links every uncertain action and reserve to verification work', () => {
    const uncertain = [
      ...dailyPlaybook.actions,
      ...dailyPlaybook.stockpiles.flatMap((plan) => plan.items),
    ].filter((entry) => entry.confidence !== 'high')

    expect(uncertain.length).toBeGreaterThan(0)
    expect(uncertain.every((entry) => entry.verificationIds?.length)).toBe(true)
  })

  it('provides actions for every Duel phase and Survival theme', () => {
    const phaseIds = new Set(
      dailyPlaybook.actions.map((action) => action.phaseId).filter(Boolean),
    )
    const themeIds = new Set(
      dailyPlaybook.actions.map((action) => action.themeId).filter(Boolean),
    )

    expect(phaseIds).toEqual(
      new Set([
        'AD-PREP-SUNDAY',
        'AD-D1-RAVEN',
        'AD-D2-CONSTRUCTION',
        'AD-D3-TECH',
        'AD-D4-HERO',
        'AD-D5-PREPARATION',
        'AD-D6-RAID',
      ]),
    )
    expect(themeIds).toEqual(
      new Set(['SB-BUILD', 'SB-TRAIN', 'SB-RESEARCH', 'SB-RAVEN', 'SB-HEROES']),
    )
  })
})
