import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { parseDailyPlaybook } from '../data/daily-playbook'
import { phaseNames, themeNames } from '../data/checklist'
import { localize } from '../i18n'
import { useApp } from '../state/app-context'
import { useChecklistData } from '../state/checklist-data-context'
import type {
  ChecklistTask,
  DailyPlaybookData,
  EventId,
  StockpileItem,
} from '../types'

const copy = {
  ru: {
    title: 'Управление чек-листом',
    lead: 'Редактируйте действия, списки запасов и порядок их показа.',
    restricted: 'Закрытый контур',
    loginTitle: 'Вход администратора',
    loginLead: 'Введите временный пароль администратора.',
    password: 'Пароль',
    signIn: 'Войти',
    signingIn: 'Проверка…',
    invalidPassword: 'Пароль не принят.',
    tooManyAttempts: 'Слишком много попыток. Повторите через минуту.',
    actions: 'Действия',
    reserves: 'Запасы на будущие дни',
    addAction: 'Добавить действие',
    addReserve: 'Добавить запас',
    save: 'Сохранить изменения',
    saving: 'Сохранение…',
    saved: 'Изменения сохранены',
    unsaved: 'Есть несохранённые изменения',
    logout: 'Выйти',
    russian: 'Текст на русском',
    english: 'Текст на английском',
    event: 'Событие',
    phase: 'Фаза',
    theme: 'Тема',
    general: 'Каждая стадия',
    activeDay: 'Каждый активный день',
    moveUp: 'Переместить выше',
    moveDown: 'Переместить ниже',
    remove: 'Удалить',
    deleteConfirm: 'Удалить эту запись?',
    saveError: 'Не удалось сохранить изменения. Проверьте поля и повторите.',
    conflictError: 'Чек-лист уже изменён в другом окне. Перезагрузите данные перед повторным сохранением.',
    sessionError: 'Не удалось проверить сеанс администратора.',
    loadingData: 'Загрузка актуального чек-листа…',
    loadError: 'Редактирование заблокировано: серверный чек-лист недоступен.',
    retry: 'Повторить загрузку',
    alliance: 'Дуэль альянсов',
    survival: 'Битва за выживание',
  },
  en: {
    title: 'Checklist administration',
    lead: 'Edit actions, future reserves, and their display order.',
    restricted: 'Restricted circuit',
    loginTitle: 'Administrator sign-in',
    loginLead: 'Enter the temporary administrator password.',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Checking…',
    invalidPassword: 'The password was not accepted.',
    tooManyAttempts: 'Too many attempts. Try again in one minute.',
    actions: 'Actions',
    reserves: 'Future reserves',
    addAction: 'Add action',
    addReserve: 'Add reserve',
    save: 'Save changes',
    saving: 'Saving…',
    saved: 'Changes saved',
    unsaved: 'Unsaved changes',
    logout: 'Sign out',
    russian: 'Russian text',
    english: 'English text',
    event: 'Event',
    phase: 'Phase',
    theme: 'Theme',
    general: 'Every round',
    activeDay: 'Every active day',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Delete',
    deleteConfirm: 'Delete this entry?',
    saveError: 'Changes could not be saved. Check the fields and try again.',
    conflictError: 'The checklist changed in another editor. Reload it before saving again.',
    sessionError: 'The administrator session could not be checked.',
    loadingData: 'Loading the current checklist…',
    loadError: 'Editing is locked because the server checklist is unavailable.',
    retry: 'Retry loading',
    alliance: 'Alliance Duel',
    survival: 'Survival Battle',
  },
} as const

const alliancePhases = [
  'AD-PREP-SUNDAY',
  'AD-D1-RAVEN',
  'AD-D2-CONSTRUCTION',
  'AD-D3-TECH',
  'AD-D4-HERO',
  'AD-D5-PREPARATION',
  'AD-D6-RAID',
]

const survivalThemes = [
  'SB-BUILD',
  'SB-TRAIN',
  'SB-RESEARCH',
  'SB-RAVEN',
  'SB-HEROES',
]

function cloneData(data: DailyPlaybookData): DailyPlaybookData {
  return structuredClone(data)
}

function move<T>(items: T[], index: number, offset: -1 | 1): T[] {
  const target = index + offset
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function createAction(): ChecklistTask {
  return {
    id: `admin-action-${crypto.randomUUID()}`,
    eventId: 'alliance-duel',
    phaseId: 'AD-D1-RAVEN',
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
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error' | 'conflict'>('idle')
  const [tab, setTab] = useState<'actions' | 'reserves'>('actions')

  useEffect(() => {
    void fetch('/api/admin/session', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Session check failed with ${response.status}.`)
        const session = await response.json() as { authorized: boolean }
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

  const updateDraft = (next: DailyPlaybookData) => {
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
      setDraft(cloneData(saved))
      setDirty(false)
      setSaveState('saved')
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

  const updateAction = (index: number, action: ChecklistTask) => {
    const actions = [...draft.actions]
    actions[index] = action
    updateDraft({ ...draft, actions })
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
            {loginError && <p className="admin-error" role="alert">{loginError}</p>}
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
          <div className="admin-tabs" role="tablist">
            <button
              className={tab === 'actions' ? 'active' : ''}
              role="tab"
              aria-selected={tab === 'actions'}
              onClick={() => setTab('actions')}
            >
              {text.actions} <span>{draft.actions.length}</span>
            </button>
            <button
              className={tab === 'reserves' ? 'active' : ''}
              role="tab"
              aria-selected={tab === 'reserves'}
              onClick={() => setTab('reserves')}
            >
              {text.reserves}{' '}
              <span>{draft.stockpiles.reduce((sum, plan) => sum + plan.items.length, 0)}</span>
            </button>
          </div>
          <div className="admin-save-actions">
            <span className={`admin-save-status ${saveState}`}>
              {saveState === 'saved'
                ? text.saved
                : saveState === 'conflict'
                  ? text.conflictError
                : saveState === 'error'
                  ? text.saveError
                  : dirty
                    ? text.unsaved
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

        {tab === 'actions' ? (
          <div className="admin-entry-list">
            {draft.actions.map((action, index) => (
              <article className="admin-entry" key={action.id}>
                <div className="admin-entry-order">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <button
                    type="button"
                    aria-label={text.moveUp}
                    disabled={index === 0}
                    onClick={() => updateDraft({ ...draft, actions: move([...draft.actions], index, -1) })}
                  >
                    <ArrowUp aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={text.moveDown}
                    disabled={index === draft.actions.length - 1}
                    onClick={() => updateDraft({ ...draft, actions: move([...draft.actions], index, 1) })}
                  >
                    <ArrowDown aria-hidden="true" />
                  </button>
                </div>
                <div className="admin-entry-fields">
                  <label className="admin-field">
                    <span>{text.russian}</span>
                    <input
                      value={action.label.ru}
                      onChange={(event) =>
                        updateAction(index, {
                          ...action,
                          label: { ...action.label, ru: event.target.value },
                        })}
                      required
                    />
                  </label>
                  <label className="admin-field">
                    <span>{text.english}</span>
                    <input
                      value={action.label.en}
                      onChange={(event) =>
                        updateAction(index, {
                          ...action,
                          label: { ...action.label, en: event.target.value },
                        })}
                      required
                    />
                  </label>
                  <label className="admin-field compact">
                    <span>{text.event}</span>
                    <select
                      value={action.eventId}
                      onChange={(event) => {
                        const eventId = event.target.value as EventId
                        updateAction(index, {
                          ...action,
                          eventId,
                          phaseId: eventId === 'alliance-duel' ? 'AD-D1-RAVEN' : undefined,
                          themeId: eventId === 'survival-battle' ? 'SB-BUILD' : undefined,
                          schedule: undefined,
                        })
                      }}
                    >
                      <option value="alliance-duel">{text.alliance}</option>
                      <option value="survival-battle">{text.survival}</option>
                    </select>
                  </label>
                  {action.eventId === 'alliance-duel' ? (
                    <label className="admin-field compact">
                      <span>{text.phase}</span>
                      <select
                        value={action.schedule === 'active-day' ? 'active-day' : action.phaseId}
                        onChange={(event) =>
                          updateAction(index, {
                            ...action,
                            schedule: event.target.value === 'active-day' ? 'active-day' : undefined,
                            phaseId: event.target.value === 'active-day' ? undefined : event.target.value,
                          })}
                      >
                        <option value="active-day">{text.activeDay}</option>
                        {alliancePhases.map((phaseId) => (
                          <option key={phaseId} value={phaseId}>
                            {localize(locale, phaseNames[phaseId])}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="admin-field compact">
                      <span>{text.theme}</span>
                      <select
                        value={action.themeId ?? ''}
                        onChange={(event) =>
                          updateAction(index, {
                            ...action,
                            themeId: event.target.value || undefined,
                          })}
                      >
                        <option value="">{text.general}</option>
                        {survivalThemes.map((themeId) => (
                          <option key={themeId} value={themeId}>
                            {localize(locale, themeNames[themeId])}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                <button
                  className="admin-delete"
                  type="button"
                  aria-label={text.remove}
                  onClick={() => {
                    if (window.confirm(text.deleteConfirm)) {
                      updateDraft({
                        ...draft,
                        actions: draft.actions.filter((_, actionIndex) => actionIndex !== index),
                      })
                    }
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </article>
            ))}
            <button
              className="admin-add-row"
              type="button"
              onClick={() => updateDraft({ ...draft, actions: [...draft.actions, createAction()] })}
            >
              <Plus aria-hidden="true" />
              {text.addAction}
            </button>
          </div>
        ) : (
          <div className="admin-stockpile-list">
            {draft.stockpiles.map((plan, planIndex) => (
              <section className="admin-stockpile" key={plan.id}>
                <div className="admin-stockpile-heading">
                  <select
                    aria-label={text.phase}
                    value={plan.targetPhaseId}
                    onChange={(event) => {
                      const stockpiles = [...draft.stockpiles]
                      stockpiles[planIndex] = { ...plan, targetPhaseId: event.target.value }
                      updateDraft({ ...draft, stockpiles })
                    }}
                  >
                    {alliancePhases.filter((phaseId) => phaseId !== 'AD-PREP-SUNDAY').map((phaseId) => (
                      <option key={phaseId} value={phaseId}>
                        {localize(locale, phaseNames[phaseId])}
                      </option>
                    ))}
                  </select>
                  <span>{plan.items.length}</span>
                </div>
                <div className="admin-entry-list">
                  {plan.items.map((item, itemIndex) => (
                    <article className="admin-entry reserve-entry" key={item.id}>
                      <div className="admin-entry-order">
                        <span>{String(itemIndex + 1).padStart(2, '0')}</span>
                        <button
                          type="button"
                          aria-label={text.moveUp}
                          disabled={itemIndex === 0}
                          onClick={() => {
                            const stockpiles = [...draft.stockpiles]
                            stockpiles[planIndex] = {
                              ...plan,
                              items: move([...plan.items], itemIndex, -1),
                            }
                            updateDraft({ ...draft, stockpiles })
                          }}
                        >
                          <ArrowUp aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={text.moveDown}
                          disabled={itemIndex === plan.items.length - 1}
                          onClick={() => {
                            const stockpiles = [...draft.stockpiles]
                            stockpiles[planIndex] = {
                              ...plan,
                              items: move([...plan.items], itemIndex, 1),
                            }
                            updateDraft({ ...draft, stockpiles })
                          }}
                        >
                          <ArrowDown aria-hidden="true" />
                        </button>
                      </div>
                      <div className="admin-entry-fields">
                        <label className="admin-field">
                          <span>{text.russian}</span>
                          <input
                            value={item.label.ru}
                            onChange={(event) => {
                              const items = [...plan.items]
                              items[itemIndex] = {
                                ...item,
                                label: { ...item.label, ru: event.target.value },
                              }
                              const stockpiles = [...draft.stockpiles]
                              stockpiles[planIndex] = { ...plan, items }
                              updateDraft({ ...draft, stockpiles })
                            }}
                          />
                        </label>
                        <label className="admin-field">
                          <span>{text.english}</span>
                          <input
                            value={item.label.en}
                            onChange={(event) => {
                              const items = [...plan.items]
                              items[itemIndex] = {
                                ...item,
                                label: { ...item.label, en: event.target.value },
                              }
                              const stockpiles = [...draft.stockpiles]
                              stockpiles[planIndex] = { ...plan, items }
                              updateDraft({ ...draft, stockpiles })
                            }}
                          />
                        </label>
                      </div>
                      <button
                        className="admin-delete"
                        type="button"
                        aria-label={text.remove}
                        onClick={() => {
                          if (window.confirm(text.deleteConfirm)) {
                            const stockpiles = [...draft.stockpiles]
                            stockpiles[planIndex] = {
                              ...plan,
                              items: plan.items.filter((_, index) => index !== itemIndex),
                            }
                            updateDraft({ ...draft, stockpiles })
                          }
                        }}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </article>
                  ))}
                  <button
                    className="admin-add-row"
                    type="button"
                    onClick={() => {
                      const stockpiles = [...draft.stockpiles]
                      stockpiles[planIndex] = {
                        ...plan,
                        items: [...plan.items, createReserve()],
                      }
                      updateDraft({ ...draft, stockpiles })
                    }}
                  >
                    <Plus aria-hidden="true" />
                    {text.addReserve}
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}

        {(saveState === 'saved' || saveState === 'conflict') && (
          <div className={`admin-saved-banner ${saveState}`} role="status">
            {saveState === 'saved' && <CheckCircle2 aria-hidden="true" />}
            {saveState === 'saved' ? text.saved : text.conflictError}
          </div>
        )}
      </section>
    </div>
  )
}
