import {
  Archive,
  AlertTriangle,
  Check,
  CheckCircle2,
  Eraser,
  Link2,
  ListChecks,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'
import { phaseNames, themeNames } from '../data/checklist'
import { localize, translate } from '../i18n'
import { useEventStatus } from '../hooks/useEventStatus'
import { useApp } from '../state/app-context'
import { useChecklistData } from '../state/checklist-data-context'
import type { ChecklistTask, EventId } from '../types'

interface TodayChecklistProps {
  compact?: boolean
}

const alliancePhaseOrder = [
  'AD-D1-RAVEN',
  'AD-D2-CONSTRUCTION',
  'AD-D3-TECH',
  'AD-D4-HERO',
  'AD-D5-PREPARATION',
  'AD-D6-RAID',
]

function taskCycleKey(
  task: ChecklistTask,
  keys: { duelCycleKey: string; survivalCycleKey: string },
): string {
  return task.eventId === 'alliance-duel' ? keys.duelCycleKey : keys.survivalCycleKey
}

export function TodayChecklist({ compact = false }: TodayChecklistProps) {
  const {
    state,
    storageIssue,
    isComplete,
    toggleComplete,
    clearCycle,
    clearAll,
  } = useApp()
  const { data: dailyPlaybook, error: checklistError } = useChecklistData()
  const status = useEventStatus()
  const [confirmMode, setConfirmMode] = useState<'today' | 'all' | null>(null)
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  const allianceTasks = dailyPlaybook.actions.filter(
    (task) =>
      task.eventId === 'alliance-duel' &&
      (task.phaseId === status.alliancePhaseId ||
        (task.schedule === 'active-day' && status.alliancePhaseId !== 'AD-PREP-SUNDAY')),
  )
  const survivalTasks = dailyPlaybook.actions.filter(
    (task) =>
      task.eventId === 'survival-battle' &&
      (!task.themeId || task.themeId === status.currentRound.themeId),
  )
  const allTasks = [...allianceTasks, ...survivalTasks]
  const visibleTasks = compact
    ? [
        ...allianceTasks.slice(0, 4),
        ...survivalTasks.filter((task) => task.themeId).slice(0, 2),
        ...survivalTasks.filter((task) => !task.themeId).slice(0, 2),
      ]
    : allTasks
  const currentPhaseIndex = alliancePhaseOrder.indexOf(status.alliancePhaseId)
  const upcomingStart = currentPhaseIndex < 0 ? 0 : currentPhaseIndex + 1
  const stockpilePlans = Array.from(
    { length: compact ? 2 : 3 },
    (_, offset) => alliancePhaseOrder[(upcomingStart + offset) % alliancePhaseOrder.length],
  )
    .map((phaseId) =>
      dailyPlaybook.stockpiles.find((plan) => plan.targetPhaseId === phaseId),
    )
    .filter((plan) => plan !== undefined)

  const completionTaskId = (task: ChecklistTask) =>
    task.eventId === 'survival-battle' && task.themeId
      ? `${task.id}:round-${status.currentRound.index}`
      : task.id

  const done = allTasks.filter((task) =>
    isComplete(task.eventId, taskCycleKey(task, status), completionTaskId(task)),
  ).length
  const progress = allTasks.length === 0 ? 0 : Math.round((done / allTasks.length) * 100)

  const renderTask = (task: ChecklistTask) => {
    const cycleKey = taskCycleKey(task, status)
    const storedTaskId = completionTaskId(task)
    const checked = isComplete(task.eventId, cycleKey, storedTaskId)
    const overlaps =
      task.eventId === 'alliance-duel' &&
      task.overlapGroups?.some((group) => status.activeOverlapGroups.includes(group))

    return (
      <li key={task.id} className={checked ? 'checklist-item checked' : 'checklist-item'}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleComplete(task.eventId, cycleKey, storedTaskId)}
          />
          <span className="custom-check" aria-hidden="true"><Check size={16} /></span>
          <span className="task-copy">
            <strong>{localize(locale, task.label)}</strong>
          </span>
        </label>
        {overlaps && (
          <span className="overlap-badge" title={t('independentOverlapHelp')}>
            <Link2 aria-hidden="true" size={14} />
            {t('independentOverlap')}
          </span>
        )}
      </li>
    )
  }

  return (
    <section className={compact ? 'checklist-panel compact-checklist' : 'checklist-panel'}>
      <div className="checklist-header">
        <div>
          <h2>{t('checklistTitle')}</h2>
          <p>{done === allTasks.length && allTasks.length > 0 ? t('allCompleted') : t('checklistLead')}</p>
        </div>
        <div className="progress-readout" aria-label={`${progress}%`}>
          <strong>{done}/{allTasks.length}</strong>
          <span>{t('tasksDone')}</span>
        </div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      {storageIssue && (
        <div className="warning-strip compact" role="status">
          <AlertTriangle aria-hidden="true" size={18} />
          <span><strong>{t('storageProblem')}.</strong> {t('storageRecovery')}</span>
        </div>
      )}

      {checklistError && (
        <div className="warning-strip compact" role="status">
          <AlertTriangle aria-hidden="true" size={18} />
          <span>{t('checklistLoadError')}</span>
        </div>
      )}

      <div className="playbook-section">
        <div className="playbook-section-heading">
          <ListChecks aria-hidden="true" size={20} />
          <div>
            <h3>{t('actionsNow')}</h3>
            <p>{t('actionsNowLead')}</p>
          </div>
        </div>
        {visibleTasks.length ? (
          <div className="checklist-groups">
            {(['alliance-duel', 'survival-battle'] as EventId[]).map((eventId) => {
              const tasks = visibleTasks.filter((task) => task.eventId === eventId)
              if (!tasks.length) return null
              return (
                <section key={eventId} className="checklist-group">
                  <div className="group-label">
                    <span>{eventId === 'alliance-duel' ? t('navAlliance') : t('navSurvival')}</span>
                    <small>
                      {eventId === 'alliance-duel'
                        ? localize(locale, phaseNames[status.alliancePhaseId])
                        : localize(locale, themeNames[status.currentRound.themeId])}
                    </small>
                  </div>
                  <ul>{tasks.map(renderTask)}</ul>
                </section>
              )
            })}
          </div>
        ) : (
          <p className="empty-state"><CheckCircle2 aria-hidden="true" /> {t('checklistEmpty')}</p>
        )}
      </div>

      <section className="playbook-section stockpile-section">
        <div className="playbook-section-heading">
          <Archive aria-hidden="true" size={20} />
          <div>
            <h3>{t('saveForLater')}</h3>
            <p>{t('saveForLaterLead')}</p>
          </div>
        </div>
        <div className="stockpile-grid">
          {stockpilePlans.map((plan) => (
            <article className="stockpile-manifest" key={plan.id}>
              <h4>{localize(locale, phaseNames[plan.targetPhaseId])}</h4>
              <ul>
                {plan.items.map((item) => (
                  <li key={item.id}>
                    <span>{localize(locale, item.label)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {!compact && (
        <div className="checklist-actions">
          <button className="button quiet" type="button" onClick={() => setConfirmMode('today')}>
            <Eraser aria-hidden="true" size={16} />
            {t('clearToday')}
          </button>
          <button className="button danger" type="button" onClick={() => setConfirmMode('all')}>
            <RotateCcw aria-hidden="true" size={16} />
            {t('clearAll')}
          </button>
        </div>
      )}

      {confirmMode && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            aria-describedby="clear-description"
          >
            <AlertTriangle aria-hidden="true" size={28} />
            <h2 id="clear-title">{t('clearTitle')}</h2>
            <p id="clear-description">{confirmMode === 'today' ? t('clearTodayBody') : t('clearAllBody')}</p>
            <div className="dialog-actions">
              <button className="button secondary" type="button" onClick={() => setConfirmMode(null)}>
                {t('cancel')}
              </button>
              <button
                className="button danger"
                type="button"
                onClick={() => {
                  if (confirmMode === 'today') {
                    clearCycle([
                      { eventId: 'alliance-duel', cycleKey: status.duelCycleKey },
                      { eventId: 'survival-battle', cycleKey: status.survivalCycleKey },
                    ])
                  } else {
                    clearAll()
                  }
                  setConfirmMode(null)
                }}
              >
                {t('confirm')}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
