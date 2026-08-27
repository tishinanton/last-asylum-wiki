import { CheckCircle2, LogOut, Plus, Save, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AdminActionModal } from '../components/AdminActionModal'
import { AdminReserveModal } from '../components/AdminReserveModal'
import { PageHeader } from '../components/PageHeader'
import { phaseNames } from '../data/checklist'
import { parseDailyPlaybook } from '../data/daily-playbook'
import { localize } from '../i18n'
import { useApp } from '../state/app-context'
import { useChecklistData } from '../state/checklist-data-context'
import type {
  ChecklistTask,
  DailyPlaybookData,
  Locale,
  StockpileItem,
  StockpilePlan,
} from '../types'

type TabId =
  | 'AD-PREP-SUNDAY'
  | 'AD-D1-RAVEN'
  | 'AD-D2-CONSTRUCTION'
  | 'AD-D3-TECH'
  | 'AD-D4-HERO'
  | 'AD-D5-PREPARATION'
  | 'AD-D6-RAID'
  | 'active-day'
  | 'survival-battle'

interface EditorTarget<T> {
  value: T
  isNew: boolean
}

const phaseTabs: TabId[] = [
  'AD-PREP-SUNDAY',
  'AD-D1-RAVEN',
  'AD-D2-CONSTRUCTION',
  'AD-D3-TECH',
  'AD-D4-HERO',
  'AD-D5-PREPARATION',
  'AD-D6-RAID',
  'active-day',
  'survival-battle',
]

const copy = {
  ru: {
    title: 'Управление чек-листом',
    lead:
      'Действия сгруппированы по дням Дуэли. Откройте запись, чтобы изменить текст или добавить пошаговую фотоинструкцию.',
    restricted: 'Закрытый контур',
    loginTitle: 'Вход администратора',
    loginLead: 'Введите временный пароль администратора.',
    password: 'Пароль',
    signIn: 'Войти',
    signingIn: 'Проверка…',
    invalidPassword: 'Пароль не принят.',
    tooManyAttempts: 'Слишком много попыток. Повторите через минуту.',
    sessionError: 'Не удалось проверить сеанс администратора.',
    loadingData: 'Загрузка актуального чек-листа…',
    loadError: 'Редактирование заблокировано: серверный чек-лист недоступен.',
    retry: 'Повторить загрузку',
    actions: 'Действия',
    reserves: 'Сохранить к этому дню',
    addAction: 'Добавить действие',
    addReserve: 'Добавить запас',
    edit: 'Изменить',
    remove: 'Удалить',
    moveUp: 'Переместить выше',
    moveDown: 'Переместить ниже',
    noActions: 'В этом разделе пока нет действий.',
    noReserves: 'Для этого дня запасы не назначены.',
    tutorial: 'Фотоинструкция',
    noTutorial: 'Без инструкции',
    photoCount: (count: number) => `${count} фото`,
    save: 'Сохранить изменения',
    saving: 'Сохранение…',
    saved: 'Изменения сохранены',
    unsaved: 'Есть несохранённые изменения',
    logout: 'Выйти',
    saveError: 'Не удалось сохранить изменения. Проверьте поля и повторите.',
    conflictError:
      'Чек-лист уже изменён в другом окне. Перезагрузите данные перед повторным сохранением.',
    deleteAction: 'Удалить это действие?',
    deleteReserve: 'Удалить этот пункт запасов?',
    activeDay: 'Каждый день',
    survival: 'Survival Battle',
    preparation: 'Воскресенье',
    day: 'День',
    phaseNavigation: 'Дни Дуэли и отдельные группы',
    revision: 'Ревизия',
  },
  en: {
    title: 'Checklist administration',
    lead:
      'Actions are grouped by Duel day. Open an entry to change its text or build a step-by-step photo tutorial.',
    restricted: 'Restricted circuit',
    loginTitle: 'Administrator sign-in',
    loginLead: 'Enter the temporary administrator password.',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Checking…',
    invalidPassword: 'The password was not accepted.',
    tooManyAttempts: 'Too many attempts. Try again in one minute.',
    sessionError: 'The administrator session could not be checked.',
    loadingData: 'Loading the current checklist…',
    loadError: 'Editing is locked because the server checklist is unavailable.',
    retry: 'Retry loading',
    actions: 'Actions',
    reserves: 'Save for this day',
    addAction: 'Add action',
    addReserve: 'Add reserve',
    edit: 'Edit',
    remove: 'Delete',
    moveUp: 'Move up',
    moveDown: 'Move down',
    noActions: 'No actions in this section yet.',
    noReserves: 'No reserves assigned to this day.',
    tutorial: 'Photo tutorial',
    noTutorial: 'No tutorial',
    photoCount: (count: number) => `${count} photos`,
    save: 'Save changes',
    saving: 'Saving…',
    saved: 'Changes saved',
    unsaved: 'Unsaved changes',
    logout: 'Sign out',
    saveError: 'Changes could not be saved. Check the fields and try again.',
    conflictError:
      'The checklist changed in another editor. Reload it before saving again.',
    deleteAction: 'Delete this action?',
    deleteReserve: 'Delete this reserve item?',
    activeDay: 'Every day',
    survival: 'Survival Battle',
    preparation: 'Sunday',
    day: 'Day',
    phaseNavigation: 'Duel days and separate groups',
    revision: 'Revision',
  },
} as const

function tabLabel(tab: TabId, locale: Locale) {
  const text = copy[locale]
  if (tab === 'AD-PREP-SUNDAY') return text.preparation
  if (tab === 'active-day') return text.activeDay
  if (tab === 'survival-battle') return text.survival
  const day = phaseTabs.indexOf(tab)
  return `${text.day} ${day}`
}

function actionBelongsToTab(action: ChecklistTask, tab: TabId) {
  if (tab === 'survival-battle') return action.eventId === 'survival-battle'
  if (tab === 'active-day') {
    return action.eventId === 'alliance-duel' && action.schedule === 'active-day'
  }
  return action.eventId === 'alliance-duel' && action.phaseId === tab
}

function createAction(tab: TabId): ChecklistTask {
  const survival = tab === 'survival-battle'
  const everyDay = tab === 'active-day'
  return {
    id: `admin-action-${crypto.randomUUID()}`,
    eventId: survival ? 'survival-battle' : 'alliance-duel',
    ...(everyDay ? { schedule: 'active-day' } : {}),
    ...(!survival && !everyDay ? { phaseId: tab } : {}),
    label: { ru: '', en: '' },
    sourceIds: ['ADMIN'],
    confidence: 'low',
    verificationIds: ['ADMIN-REVIEW'],
  }
}

function createReserve(): StockpileItem {
  return {
    id: `admin-reserve-${crypto.randomUUID()}`,
    label: { ru: '', en: '' },
    sourceIds: ['ADMIN'],
    confidence: 'low',
    verificationIds: ['ADMIN-REVIEW'],
  }
}

function move<T>(items: T[], index: number, offset: -1 | 1) {
  const target = index + offset
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function cloneData(data: DailyPlaybookData) {
  return structuredClone(data)
}

function normalizeActionOrder(actions: ChecklistTask[]) {
  const known = phaseTabs.flatMap((tab) =>
    actions.filter((action) => actionBelongsToTab(action, tab)),
  )
  const knownIds = new Set(known.map((action) => action.id))
  return [...known, ...actions.filter((action) => !knownIds.has(action.id))]
}

export function AdminPage() {
  const { state } = useApp()
  const { data, loading, error, reload, replaceData } = useChecklistData()
  const locale = state.preferences.locale
  const text = copy[locale]
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginPending, setLoginPending] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [draft, setDraft] = useState(() => cloneData(data))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] =
    useState<'idle' | 'saved' | 'error' | 'conflict'>('idle')
  const [activeTab, setActiveTab] = useState<TabId>('AD-D1-RAVEN')
  const [editingAction, setEditingAction] =
    useState<EditorTarget<ChecklistTask> | null>(null)
  const [editingReserve, setEditingReserve] =
    useState<EditorTarget<StockpileItem> | null>(null)
  const editGeneration = useRef(0)

  useEffect(() => {
    void fetch('/api/admin/session', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Session check failed with ${response.status}.`)
        const session = (await response.json()) as { authorized: boolean }
        setAuthorized(session.authorized)
      })
      .catch(() => {
        setAuthorized(false)
        setLoginError(text.sessionError)
      })
  }, [text.sessionError])

  useEffect(() => {
    if (!dirty) setDraft(cloneData(data))
  }, [data, dirty])

  const visibleActions = useMemo(
    () => draft.actions.filter((action) => actionBelongsToTab(action, activeTab)),
    [activeTab, draft.actions],
  )
  const activePlan = useMemo(
    () => draft.stockpiles.find((plan) => plan.targetPhaseId === activeTab),
    [activeTab, draft.stockpiles],
  )

  const updateDraft = (next: DailyPlaybookData) => {
    editGeneration.current += 1
    setDraft(next)
    setDirty(true)
    setSaveState('idle')
  }

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    setLoginPending(true)
    setLoginError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setLoginError(
          response.status === 429 ? text.tooManyAttempts : text.invalidPassword,
        )
        return
      }
      setAuthorized(true)
      setPassword('')
    } catch {
      setLoginError(text.sessionError)
    } finally {
      setLoginPending(false)
    }
  }

  const save = async () => {
    if (loading || error || draft.revision === undefined) {
      setSaveState('error')
      return
    }
    setSaving(true)
    setSaveState('idle')
    const submittedGeneration = editGeneration.current
    try {
      const response = await fetch('/api/admin/checklist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'LastAsylumAdmin',
        },
        body: JSON.stringify(draft),
      })
      if (response.status === 401) {
        setAuthorized(false)
        return
      }
      if (response.status === 409) {
        setSaveState('conflict')
        return
      }
      if (!response.ok) throw new Error(`Save failed with status ${response.status}.`)
      const saved = parseDailyPlaybook(await response.json())
      replaceData(saved)
      if (editGeneration.current === submittedGeneration) {
        setDraft(cloneData(saved))
        setDirty(false)
        setSaveState('saved')
      } else {
        setDraft((current) => ({ ...current, revision: saved.revision }))
        setDirty(true)
      }
    } catch {
      setSaveState('error')
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined)
    setAuthorized(false)
    setDirty(false)
    setDraft(cloneData(data))
  }

  const replaceAction = (action: ChecklistTask) => {
    updateDraft({
      ...draft,
      actions: normalizeActionOrder(
        editingAction?.isNew
          ? [...draft.actions, action]
          : draft.actions.map((item) => (item.id === action.id ? action : item)),
      ),
    })
    setEditingAction(null)
  }

  const replaceReserve = (item: StockpileItem) => {
    if (!activePlan) return
    const stockpiles = draft.stockpiles.map((plan) =>
      plan.id === activePlan.id
        ? {
            ...plan,
            items: editingReserve?.isNew
              ? [...plan.items, item]
              : plan.items.map((entry) => (entry.id === item.id ? item : entry)),
          }
        : plan,
    )
    updateDraft({ ...draft, stockpiles })
    setEditingReserve(null)
  }

  const updateVisibleActionOrder = (index: number, offset: -1 | 1) => {
    const target = index + offset
    if (target < 0 || target >= visibleActions.length) return
    const firstIndex = draft.actions.findIndex((item) => item.id === visibleActions[index].id)
    const secondIndex = draft.actions.findIndex(
      (item) => item.id === visibleActions[target].id,
    )
    const actions = [...draft.actions]
    ;[actions[firstIndex], actions[secondIndex]] = [actions[secondIndex], actions[firstIndex]]
    updateDraft({ ...draft, actions: normalizeActionOrder(actions) })
  }

  const updatePlan = (nextPlan: StockpilePlan) => {
    updateDraft({
      ...draft,
      stockpiles: draft.stockpiles.map((plan) =>
        plan.id === nextPlan.id ? nextPlan : plan,
      ),
    })
  }

  if (authorized !== true) {
    return (
      <div className="page admin-page">
        <PageHeader title={text.title} lead={text.lead} meta={text.restricted} />
        <section className="admin-login">
          <ShieldCheck aria-hidden="true" size={34} />
          <h2>{text.loginTitle}</h2>
          <p>{text.loginLead}</p>
          <form onSubmit={signIn}>
            <label>
              <span>{text.password}</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {loginError && (
              <p className="admin-error" role="alert">
                {loginError}
              </p>
            )}
            <button className="button primary" type="submit" disabled={loginPending}>
              {loginPending ? text.signingIn : text.signIn}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (loading || error) {
    return (
      <div className="page admin-page">
        <PageHeader title={text.title} lead={text.lead} meta={text.restricted} />
        <section className="admin-login admin-data-state">
          <ShieldCheck aria-hidden="true" size={34} />
          <h2>{loading ? text.loadingData : text.loadError}</h2>
          {error && (
            <button className="button secondary" type="button" onClick={() => void reload()}>
              {text.retry}
            </button>
          )}
        </section>
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <PageHeader title={text.title} lead={text.lead} meta={text.restricted} />

      <section className="admin-workbench">
        <div className="admin-toolbar">
          <div className="admin-revision">
            <span>{text.revision}</span>
            <strong>{draft.revision}</strong>
            {dirty && <em>{text.unsaved}</em>}
          </div>
          <div className="admin-save-actions">
            <span className={`admin-save-status ${saveState}`} role="status">
              {saveState === 'saved'
                ? text.saved
                : saveState === 'conflict'
                  ? text.conflictError
                  : saveState === 'error'
                    ? text.saveError
                    : ''}
            </span>
            <button
              className="button primary"
              type="button"
              disabled={!dirty || saving}
              onClick={() => void save()}
            >
              <Save aria-hidden="true" size={16} />
              {saving ? text.saving : text.save}
            </button>
            <button className="button quiet" type="button" onClick={() => void logout()}>
              <LogOut aria-hidden="true" size={16} />
              {text.logout}
            </button>
          </div>
        </div>

        <div className="admin-tabs-viewport">
          <div className="admin-day-tabs" role="tablist" aria-label={text.phaseNavigation}>
            {phaseTabs.map((tab) => {
              const count = draft.actions.filter((action) =>
                actionBelongsToTab(action, tab),
              ).length
              return (
                <button
                  key={tab}
                  id={`admin-tab-${tab}`}
                  className={activeTab === tab ? 'active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="admin-day-panel"
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tabLabel(tab, locale)}</span>
                  <strong>{count}</strong>
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="admin-day-panel"
          className="admin-day-panel"
          role="tabpanel"
          aria-labelledby={`admin-tab-${activeTab}`}
        >
          <section className="admin-list-section" aria-labelledby="admin-actions-title">
            <header className="admin-section-heading">
              <div>
                <h2 id="admin-actions-title">{text.actions}</h2>
                <span>{visibleActions.length}</span>
              </div>
              <button
                className="button secondary"
                type="button"
                onClick={() =>
                  setEditingAction({ value: createAction(activeTab), isNew: true })
                }
              >
                <Plus aria-hidden="true" size={16} />
                {text.addAction}
              </button>
            </header>

            {visibleActions.length ? (
              <ol className="admin-display-list">
                {visibleActions.map((action, index) => (
                  <li key={action.id}>
                    <span className="admin-row-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="admin-row-copy">
                      <strong>{localize(locale, action.label)}</strong>
                      <small>
                        {action.tutorial?.length
                          ? `${text.tutorial}: ${text.photoCount(action.tutorial.length)}`
                          : text.noTutorial}
                      </small>
                    </div>
                    <div className="admin-row-controls">
                      <button
                        className="admin-order-button"
                        type="button"
                        aria-label={text.moveUp}
                        disabled={index === 0}
                        onClick={() => updateVisibleActionOrder(index, -1)}
                      >
                        ↑
                      </button>
                      <button
                        className="admin-order-button"
                        type="button"
                        aria-label={text.moveDown}
                        disabled={index === visibleActions.length - 1}
                        onClick={() => updateVisibleActionOrder(index, 1)}
                      >
                        ↓
                      </button>
                      <button
                        className="admin-edit-button"
                        type="button"
                        onClick={() =>
                          setEditingAction({
                            value: structuredClone(action),
                            isNew: false,
                          })
                        }
                      >
                        {text.edit}
                      </button>
                      <button
                        className="admin-remove-button"
                        type="button"
                        onClick={() => {
                          if (window.confirm(text.deleteAction)) {
                            updateDraft({
                              ...draft,
                              actions: draft.actions.filter(
                                (item) => item.id !== action.id,
                              ),
                            })
                          }
                        }}
                      >
                        {text.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="admin-empty">{text.noActions}</p>
            )}
          </section>

          {activePlan && (
            <section className="admin-list-section" aria-labelledby="admin-reserves-title">
              <header className="admin-section-heading">
                <div>
                  <h2 id="admin-reserves-title">{text.reserves}</h2>
                  <span>{activePlan.items.length}</span>
                </div>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() =>
                    setEditingReserve({ value: createReserve(), isNew: true })
                  }
                >
                  <Plus aria-hidden="true" size={16} />
                  {text.addReserve}
                </button>
              </header>

              {activePlan.items.length ? (
                <ol className="admin-display-list reserve-list">
                  {activePlan.items.map((item, index) => (
                    <li key={item.id}>
                      <span className="admin-row-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="admin-row-copy">
                        <strong>{localize(locale, item.label)}</strong>
                        <small>{localize(locale, phaseNames[activePlan.targetPhaseId])}</small>
                      </div>
                      <div className="admin-row-controls">
                        <button
                          className="admin-order-button"
                          type="button"
                          aria-label={text.moveUp}
                          disabled={index === 0}
                          onClick={() =>
                            updatePlan({
                              ...activePlan,
                              items: move([...activePlan.items], index, -1),
                            })
                          }
                        >
                          ↑
                        </button>
                        <button
                          className="admin-order-button"
                          type="button"
                          aria-label={text.moveDown}
                          disabled={index === activePlan.items.length - 1}
                          onClick={() =>
                            updatePlan({
                              ...activePlan,
                              items: move([...activePlan.items], index, 1),
                            })
                          }
                        >
                          ↓
                        </button>
                        <button
                          className="admin-edit-button"
                          type="button"
                          onClick={() =>
                            setEditingReserve({
                              value: structuredClone(item),
                              isNew: false,
                            })
                          }
                        >
                          {text.edit}
                        </button>
                        <button
                          className="admin-remove-button"
                          type="button"
                          onClick={() => {
                            if (window.confirm(text.deleteReserve)) {
                              updatePlan({
                                ...activePlan,
                                items: activePlan.items.filter(
                                  (entry) => entry.id !== item.id,
                                ),
                              })
                            }
                          }}
                        >
                          {text.remove}
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="admin-empty">{text.noReserves}</p>
              )}
            </section>
          )}
        </div>

        {saveState === 'saved' && (
          <div className="admin-saved-banner saved" role="status">
            <CheckCircle2 aria-hidden="true" />
            {text.saved}
          </div>
        )}
      </section>

      {editingAction && (
        <AdminActionModal
          key={editingAction.value.id}
          action={editingAction.value}
          locale={locale}
          onClose={() => setEditingAction(null)}
          onSave={replaceAction}
        />
      )}
      {editingReserve && (
        <AdminReserveModal
          key={editingReserve.value.id}
          item={editingReserve.value}
          locale={locale}
          onClose={() => setEditingReserve(null)}
          onSave={replaceReserve}
        />
      )}
    </div>
  )
}
