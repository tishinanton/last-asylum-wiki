import { AlertTriangle, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { translate } from '../i18n'
import { DEFAULT_PREFERENCES } from '../lib/storage'
import { useApp } from '../state/app-context'
import type { Preferences } from '../types'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { state, updatePreferences, resetPreferences } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  const [draft, setDraft] = useState<Preferences>(state.preferences)

  useEffect(() => {
    if (open) setDraft(state.preferences)
  }, [open, state.preferences])

  if (!open) return null

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="dialog-header">
          <div>
            <h2 id="settings-title">{t('settingsTitle')}</h2>
            <p>{t('settingsLead')}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t('cancel')}>
            <X aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            updatePreferences(draft)
            onClose()
          }}
        >
          <fieldset>
            <legend>{t('navAlliance')}</legend>
            <div className="settings-grid">
              <label>
                <span>{t('duelZone')}</span>
                <select
                  value={draft.duelTimeZone}
                  onChange={(event) => setDraft({ ...draft, duelTimeZone: event.target.value })}
                >
                  <option value="UTC">{t('timeZoneUtc')}</option>
                  {localZone !== 'UTC' && <option value={localZone}>{t('timeZoneLocal')} — {localZone}</option>}
                </select>
              </label>
              <label>
                <span>{t('duelReset')}</span>
                <input
                  type="time"
                  step="1"
                  value={draft.duelResetTime}
                  onChange={(event) => setDraft({ ...draft, duelResetTime: event.target.value })}
                />
              </label>
            </div>
            <p className="field-note verified-note">{t('verified')}: 00:00 UTC [S1]</p>
          </fieldset>

          <fieldset>
            <legend>{t('navSurvival')}</legend>
            <div className="warning-strip compact">
              <AlertTriangle aria-hidden="true" size={18} />
              <span>{t('utcWarning')}</span>
            </div>
            <div className="settings-grid">
              <label>
                <span>{t('survivalZone')}</span>
                <select
                  value={draft.survivalTimeZone}
                  onChange={(event) => setDraft({ ...draft, survivalTimeZone: event.target.value })}
                >
                  <option value="UTC">{t('timeZoneUtc')}</option>
                  {localZone !== 'UTC' && <option value={localZone}>{t('timeZoneLocal')} — {localZone}</option>}
                </select>
              </label>
              <label>
                <span>{t('survivalReset')}</span>
                <input
                  type="time"
                  step="1"
                  value={draft.survivalResetTime}
                  onChange={(event) => setDraft({ ...draft, survivalResetTime: event.target.value })}
                />
              </label>
              <label>
                <span>{t('survivalManualDay')}</span>
                <select
                  value={draft.survivalCycleDay}
                  onChange={(event) => setDraft({ ...draft, survivalCycleDay: Number(event.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>{locale === 'ru' ? 'День' : 'Day'} {day}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t('survivalAnchor')}</span>
                <input
                  type="date"
                  value={draft.survivalCycleAnchor}
                  onChange={(event) => setDraft({ ...draft, survivalCycleAnchor: event.target.value })}
                />
                <small>{t('anchorOptional')}</small>
              </label>
            </div>
            <p className="field-note"><AlertTriangle aria-hidden="true" size={15} /> {t('anchorWarning')}</p>
          </fieldset>

          <div className="dialog-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                resetPreferences()
                setDraft({ ...DEFAULT_PREFERENCES, locale })
              }}
            >
              <RotateCcw aria-hidden="true" size={17} />
              {t('resetDefaults')}
            </button>
            <button className="button primary" type="submit">{t('saveSettings')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
