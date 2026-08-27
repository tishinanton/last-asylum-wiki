import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Radio } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { phaseNames, themeNames } from '../data/checklist'
import { localize, translate } from '../i18n'
import { formatClockMinutes, formatCountdown } from '../lib/time'
import { useApp } from '../state/app-context'
import { useEventStatus } from '../hooks/useEventStatus'

export function EventStatusBoard({ compact = false }: { compact?: boolean }) {
  const { state, now } = useApp()
  const status = useEventStatus()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  const phaseName = localize(locale, phaseNames[status.alliancePhaseId])
  const currentTheme = localize(locale, themeNames[status.currentRound.themeId])
  const nextTheme = localize(locale, themeNames[status.nextRound.themeId])
  const activeRoundRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const activeRound = activeRoundRef.current
    if (typeof activeRound?.scrollIntoView !== 'function') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeRound.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [status.currentRound.index])

  return (
    <section className={compact ? 'status-board compact-board' : 'status-board'} aria-label={locale === 'ru' ? 'Текущий статус событий' : 'Current event status'}>
      <div className="status-rail duel-rail">
        <div className="rail-label">
          <CheckCircle2 aria-hidden="true" size={16} />
          <span>{t('navAlliance')}</span>
          <em>{t('verified')}</em>
        </div>
        <div className="rail-current">
          <strong>{phaseName}</strong>
          <span>{status.alliancePhaseId}</span>
        </div>
        <div className="rail-time">
          <small>{t('nextReset')}</small>
          <time>{formatCountdown(status.duelNextReset.getTime() - now.getTime())}</time>
        </div>
        <Link className="rail-link" to="/alliance-duel" aria-label={`${t('openGuide')}: ${t('navAlliance')}`}>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="status-rail survival-rail">
        <div className="rail-label">
          <AlertTriangle aria-hidden="true" size={16} />
          <span>{t('navSurvival')}</span>
          <em>{t('unverified')}</em>
        </div>
        <div className="rail-current">
          <strong>{currentTheme}</strong>
          <span>{locale === 'ru' ? 'День' : 'Day'} {status.survivalCycleDay} · {t('round')} {status.currentRound.index + 1}/6</span>
        </div>
        <div className="rail-time">
          <small>{t('nextRound')}: {nextTheme}</small>
          <time>{formatCountdown(status.roundCountdownMs)}</time>
        </div>
        <Link className="rail-link" to="/survival-battle" aria-label={`${t('openGuide')}: ${t('navSurvival')}`}>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      {!compact && (
        <div className="round-trace" aria-label={locale === 'ru' ? 'Стадии Битвы за выживание' : 'Survival Battle rounds'}>
          <div className="trace-heading">
            <span><Radio aria-hidden="true" size={15} /> {t('cycleDay')} {status.survivalCycleDay}</span>
            <span><Clock3 aria-hidden="true" size={15} /> {state.preferences.survivalTimeZone}</span>
          </div>
          <ol>
            {status.survivalRounds.map((round) => (
              <li
                key={round.index}
                ref={round.status === 'current' ? activeRoundRef : undefined}
                className={round.status}
                aria-current={round.status === 'current' ? 'step' : undefined}
              >
                <span className="trace-node" />
                <small>{formatClockMinutes(round.startMinutes)}</small>
                <strong>{localize(locale, themeNames[round.themeId])}</strong>
              </li>
            ))}
          </ol>
          <span className="scroll-cue" aria-hidden="true">↔</span>
        </div>
      )}
    </section>
  )
}
