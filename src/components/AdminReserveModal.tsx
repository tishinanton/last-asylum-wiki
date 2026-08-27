import { useState } from 'react'
import { Modal } from './Modal'
import type { Locale, StockpileItem } from '../types'

interface AdminReserveModalProps {
  item: StockpileItem
  locale: Locale
  onClose: () => void
  onSave: (item: StockpileItem) => void
}

const copy = {
  ru: {
    title: 'Запас',
    close: 'Закрыть редактор',
    russian: 'Название на русском',
    english: 'Название на английском',
    required: 'Введите название на обоих языках.',
    cancel: 'Отмена',
    save: 'Сохранить запас',
  },
  en: {
    title: 'Reserve item',
    close: 'Close editor',
    russian: 'Russian title',
    english: 'English title',
    required: 'Enter a title in both languages.',
    cancel: 'Cancel',
    save: 'Save reserve',
  },
} as const

export function AdminReserveModal({
  item,
  locale,
  onClose,
  onSave,
}: AdminReserveModalProps) {
  const c = copy[locale]
  const [draft, setDraft] = useState(() => structuredClone(item))
  const [error, setError] = useState('')

  const submit = () => {
    if (!draft.label.ru.trim() || !draft.label.en.trim()) {
      setError(c.required)
      return
    }
    onSave({
      ...draft,
      label: { ru: draft.label.ru.trim(), en: draft.label.en.trim() },
    })
  }

  return (
    <Modal title={c.title} closeLabel={c.close} onClose={onClose}>
      <div className="admin-modal-form">
        <label>
          <span>{c.russian}</span>
          <input
            value={draft.label.ru}
            onChange={(event) =>
              setDraft({ ...draft, label: { ...draft.label, ru: event.target.value } })
            }
          />
        </label>
        <label>
          <span>{c.english}</span>
          <input
            value={draft.label.en}
            onChange={(event) =>
              setDraft({ ...draft, label: { ...draft.label, en: event.target.value } })
            }
          />
        </label>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="modal-actions">
          <button className="button secondary" type="button" onClick={onClose}>
            {c.cancel}
          </button>
          <button className="button" type="button" onClick={submit}>
            {c.save}
          </button>
        </div>
      </div>
    </Modal>
  )
}
