import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Eraser,
  Link2,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'
import { checklistSeed, phaseNames, themeNames } from '../data/checklist'
import { localize, translate } from '../i18n'
import { useEventStatus } from '../hooks/useEventStatus'
import { useApp } from '../state/app-context'
import type { ChecklistTask, EventId } from '../types'

interface TodayChecklistProps {
  compact?: boolean
}

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
  const status = useEventStatus()
  const [confirmMode, setConfirmMode] = useState<'today' | 'all' | null>(null)
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  const allianceTasks = checklistSeed.tasks.filter((task) => {
    if (task.eventId !== 'alliance-duel') return false
    if (status.alliancePhaseId === 'AD-PREP-SUNDAY') {
      return task.schedule === 'sunday-preparation'
    }
    return task.schedule === 'active-day' || task.phaseId === status.alliancePhaseId
  })
  const survivalTasks = checklistSeed.tasks.filter((task) => task.eventId === 'survival-battle')
  const allTasks = [...allianceTasks, ...survivalTasks]
  const visibleTasks = compact ? allTasks.slice(0, 5) : allTasks
  const done = allTasks.filter((task) =>
    isComplete(task.eventId, taskCycleKey(task, status), task.id),
  ).length
  const progress = allTasks.length === 0 ? 0 : Math.round((done / allTasks.length) * 100)

  const renderTask = (task: ChecklistTask) => {
    const cycleKey = taskCycleKey(task, status)
    const checked = isComplete(task.eventId, cycleKey, task.id)
    const overlaps =
      task.eventId === 'alliance-duel' &&
      task.overlapGroups?.some((group) => status.activeOverlapGroups.includes(group))

    return (
      <li key={task.id} className={checked ? 'checklist-item checked' : 'checklist-item'}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleComplete(task.eventId, cycleKey, task.id)}
          />
          <span className="custom-check" aria-hidden="true"><Check size={16} /></span>
          <span className="task-copy">
            <strong>{localize(locale, task.label)}</strong>
            <small>
              <span className={`confidence-dot confidence-${task.confidence}`} />
              {task.sourceIds.join(' · ')}
              {task.verificationIds?.length ? ` · ${task.verificationIds.join(', ')}` : ''}
            </small>
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
