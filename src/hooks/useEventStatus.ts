import { useMemo } from 'react'
import { checklistSeed, themeOverlapGroups } from '../data/checklist'
import {
  getAlliancePhase,
  getCurrentCycleDay,
  getCycleKey,
  getNextReset,
  getSurvivalRounds,
  getZonedParts,
} from '../lib/time'
import { useApp } from '../state/app-context'

export function useEventStatus() {
  const { now, state } = useApp()
  const preferences = state.preferences

  return useMemo(() => {
    const duelCycleKey = getCycleKey(now, preferences.duelTimeZone, preferences.duelResetTime)
    const survivalCycleKey = getCycleKey(
      now,
      preferences.survivalTimeZone,
      preferences.survivalResetTime,
    )
    const alliancePhaseId = getAlliancePhase(
      now,
      preferences.duelTimeZone,
      preferences.duelResetTime,
      checklistSeed.events['alliance-duel'].phases,
    )
    const survivalCycleDay = getCurrentCycleDay(
      survivalCycleKey,
      preferences.survivalCycleAnchor,
      preferences.survivalCycleDay,
    )
    const survivalRounds = getSurvivalRounds(
      now,
      preferences.survivalTimeZone,
      preferences.survivalResetTime,
      survivalCycleDay,
      checklistSeed.events['survival-battle'].cycle,
      checklistSeed.events['survival-battle'].roundDurationMinutes,
    )
    const currentRound = survivalRounds.find((round) => round.status === 'current') ?? survivalRounds[0]
    const nextRound = survivalRounds[currentRound.index + 1] ?? survivalRounds[0]
    const zoned = getZonedParts(now, preferences.survivalTimeZone)
    const secondsIntoRound =
      ((zoned.hour * 60 + zoned.minute - currentRound.startMinutes + 1440) % 1440) * 60 +
      zoned.second
    const roundCountdownMs = Math.max(
      0,
      checklistSeed.events['survival-battle'].roundDurationMinutes * 60_000 -
        secondsIntoRound * 1000,
    )
    const activeOverlapGroups = themeOverlapGroups[currentRound.themeId] ?? []

    return {
      duelCycleKey,
      survivalCycleKey,
      alliancePhaseId,
      duelNextReset: getNextReset(now, preferences.duelTimeZone, preferences.duelResetTime),
      survivalNextReset: getNextReset(
        now,
        preferences.survivalTimeZone,
        preferences.survivalResetTime,
      ),
      survivalCycleDay,
      survivalRounds,
      currentRound,
      nextRound,
      roundCountdownMs,
      activeOverlapGroups,
    }
  }, [now, preferences])
}
