import { useRef, useState, type ChangeEvent } from 'react'
import { Modal } from './Modal'
import { phaseNames, themeNames } from '../data/checklist'
import { localize } from '../i18n'
import type { ChecklistTask, EventId, Locale, TutorialSlide } from '../types'

interface AdminActionModalProps {
  action: ChecklistTask
  locale: Locale
  onClose: () => void
  onSave: (action: ChecklistTask) => void
}

const copy = {
  ru: {
    title: 'Действие',
    close: 'Закрыть редактор',
    russian: 'Название на русском',
    english: 'Название на английском',
    event: 'Событие',
    phase: 'Этап',
    activeDay: 'Каждый день Дуэли',
    survivalTheme: 'Тема Survival Battle',
    none: 'Не задано',
    tutorial: 'Мини-инструкция',
    tutorialHint: 'Добавьте до 20 изображений. JPG, PNG или WebP, не более 5 МБ.',
    addPhoto: 'Добавить фото',
    uploading: 'Загрузка…',
    descriptionRu: 'Описание фото на русском (необязательно)',
    descriptionEn: 'Описание фото на английском (необязательно)',
    earlier: 'Сдвинуть раньше',
    later: 'Сдвинуть позже',
    remove: 'Удалить фото',
    noPhotos: 'Фото пока не добавлены.',
    cancel: 'Отмена',
    save: 'Сохранить действие',
    uploadFailed: 'Не удалось загрузить изображение.',
    required: 'Введите название на обоих языках.',
  },
  en: {
    title: 'Action',
    close: 'Close editor',
    russian: 'Russian title',
    english: 'English title',
    event: 'Event',
    phase: 'Phase',
    activeDay: 'Every Duel day',
    survivalTheme: 'Survival Battle theme',
    none: 'Not set',
    tutorial: 'Mini tutorial',
    tutorialHint: 'Add up to 20 images. JPG, PNG, or WebP, up to 5 MB.',
    addPhoto: 'Add photo',
    uploading: 'Uploading…',
    descriptionRu: 'Russian photo description (optional)',
    descriptionEn: 'English photo description (optional)',
    earlier: 'Move earlier',
    later: 'Move later',
    remove: 'Remove photo',
    noPhotos: 'No photos added yet.',
    cancel: 'Cancel',
    save: 'Save action',
    uploadFailed: 'Could not upload the image.',
    required: 'Enter a title in both languages.',
  },
} as const

const phases = [
  'AD-PREP-SUNDAY',
  'AD-D1-RAVEN',
  'AD-D2-CONSTRUCTION',
  'AD-D3-TECH',
  'AD-D4-HERO',
  'AD-D5-PREPARATION',
  'AD-D6-RAID',
]

const themes = ['SB-BUILD', 'SB-TRAIN', 'SB-RESEARCH', 'SB-RAVEN', 'SB-HEROES']

function slideId() {
  return `tutorial-${crypto.randomUUID()}`
}

export function AdminActionModal({
  action,
  locale,
  onClose,
  onSave,
}: AdminActionModalProps) {
  const c = copy[locale]
  const [draft, setDraft] = useState<ChecklistTask>(() => structuredClone(action))
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const pendingUploads = useRef(new Set<string>())
  const closed = useRef(false)

  const patch = (next: Partial<ChecklistTask>) => {
    setDraft((current) => ({ ...current, ...next }))
  }

  const patchSlide = (index: number, next: Partial<TutorialSlide>) => {
    const tutorial = [...(draft.tutorial ?? [])]
    tutorial[index] = { ...tutorial[index], ...next }
    patch({ tutorial })
  }

  const moveSlide = (index: number, offset: -1 | 1) => {
    const target = index + offset
    const tutorial = [...(draft.tutorial ?? [])]
    if (target < 0 || target >= tutorial.length) return
    ;[tutorial[index], tutorial[target]] = [tutorial[target], tutorial[index]]
    patch({ tutorial })
  }

  const removeSlide = (index: number) => {
    const removed = draft.tutorial?.[index]
    if (removed && pendingUploads.current.delete(removed.imageUrl)) {
      void deletePendingUpload(removed.imageUrl)
    }
    const tutorial = (draft.tutorial ?? []).filter((_, slideIndex) => slideIndex !== index)
    patch({ tutorial: tutorial.length > 0 ? tutorial : undefined })
  }

  const deletePendingUpload = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop()
    if (!fileName) return
    await fetch(`/api/admin/tutorial-images/${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
      headers: { 'X-Requested-With': 'LastAsylumAdmin' },
      credentials: 'same-origin',
    }).catch(() => undefined)
  }

  const discardAndClose = () => {
    closed.current = true
    for (const imageUrl of pendingUploads.current) {
      void deletePendingUpload(imageUrl)
    }
    pendingUploads.current.clear()
    onClose()
  }

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setError('')
    const form = new FormData()
    form.append('image', file)

    try {
      const response = await fetch('/api/admin/tutorial-images', {
        method: 'POST',
        headers: { 'X-Requested-With': 'LastAsylumAdmin' },
        credentials: 'same-origin',
        body: form,
      })
      const body = (await response.json().catch(() => null)) as
        | { url?: string; message?: string }
        | null
      const imageUrl = body?.url
      if (!response.ok || !imageUrl) {
        throw new Error(body?.message ?? c.uploadFailed)
      }

      if (closed.current) {
        await deletePendingUpload(imageUrl)
        return
      }

      pendingUploads.current.add(imageUrl)
      setDraft((current) => ({
        ...current,
        tutorial: [
          ...(current.tutorial ?? []),
          {
            id: slideId(),
            imageUrl,
            description: { ru: '', en: '' },
          },
        ],
      }))
    } catch (reason) {
      if (!closed.current) {
        setError(reason instanceof Error ? reason.message : c.uploadFailed)
      }
    } finally {
      if (!closed.current) {
        setUploading(false)
      }
    }
  }

  const submit = () => {
    if (!draft.label.ru.trim() || !draft.label.en.trim()) {
      setError(c.required)
      return
    }

    pendingUploads.current.clear()
    closed.current = true
    onSave({
      ...draft,
      label: { ru: draft.label.ru.trim(), en: draft.label.en.trim() },
      tutorial: draft.tutorial?.map((slide) => ({
        ...slide,
        description:
          slide.description?.ru.trim() || slide.description?.en.trim()
            ? {
                ru: slide.description.ru.trim(),
                en: slide.description.en.trim(),
              }
            : undefined,
      })),
    })
  }

  return (
    <Modal title={c.title} closeLabel={c.close} onClose={discardAndClose} wide>
      <div className="admin-modal-form">
        <label>
          <span>{c.russian}</span>
          <input
            value={draft.label.ru}
            onChange={(event) => patch({ label: { ...draft.label, ru: event.target.value } })}
          />
        </label>
        <label>
          <span>{c.english}</span>
          <input
            value={draft.label.en}
            onChange={(event) => patch({ label: { ...draft.label, en: event.target.value } })}
          />
        </label>

        <div className="admin-modal-grid">
          <label>
            <span>{c.event}</span>
            <select
              value={draft.eventId}
              onChange={(event) => {
                const eventId = event.target.value as EventId
                patch({
                  eventId,
                  schedule: undefined,
                  phaseId: eventId === 'alliance-duel' ? 'AD-D1-RAVEN' : undefined,
                  themeId: undefined,
                })
              }}
            >
              <option value="alliance-duel">Alliance Duel</option>
              <option value="survival-battle">Survival Battle</option>
            </select>
          </label>
          {draft.eventId === 'alliance-duel' ? (
            <label>
              <span>{c.phase}</span>
              <select
                value={draft.schedule === 'active-day' ? 'active-day' : draft.phaseId}
                onChange={(event) =>
                  patch({
                    schedule: event.target.value === 'active-day' ? 'active-day' : undefined,
                    phaseId:
                      event.target.value === 'active-day' ? undefined : event.target.value,
                  })
                }
              >
                <option value="active-day">{c.activeDay}</option>
                {phases.map((phaseId) => (
                  <option key={phaseId} value={phaseId}>
                    {localize(locale, phaseNames[phaseId])}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label>
              <span>{c.survivalTheme}</span>
              <select
                value={draft.themeId ?? ''}
                onChange={(event) => patch({ themeId: event.target.value || undefined })}
              >
                <option value="">{c.none}</option>
                {themes.map((themeId) => (
                  <option key={themeId} value={themeId}>
                    {localize(locale, themeNames[themeId])}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <section className="tutorial-editor" aria-labelledby="tutorial-editor-title">
          <div className="tutorial-editor__heading">
            <div>
              <h3 id="tutorial-editor-title">{c.tutorial}</h3>
              <p>{c.tutorialHint}</p>
            </div>
            <label className={`button secondary upload-button${uploading ? ' is-busy' : ''}`}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={uploadPhoto}
                disabled={uploading || (draft.tutorial?.length ?? 0) >= 20}
              />
              {uploading ? c.uploading : c.addPhoto}
            </label>
          </div>

          {draft.tutorial?.length ? (
            <ol className="tutorial-editor__slides">
              {draft.tutorial.map((slide, index) => (
                <li key={slide.id}>
                  <img src={slide.imageUrl} alt={`${c.tutorial} ${index + 1}`} />
                  <div className="tutorial-editor__fields">
                    <input
                      aria-label={c.descriptionRu}
                      placeholder={c.descriptionRu}
                      value={slide.description?.ru ?? ''}
                      onChange={(event) =>
                        patchSlide(index, {
                          description: {
                            ru: event.target.value,
                            en: slide.description?.en ?? '',
                          },
                        })
                      }
                    />
                    <input
                      aria-label={c.descriptionEn}
                      placeholder={c.descriptionEn}
                      value={slide.description?.en ?? ''}
                      onChange={(event) =>
                        patchSlide(index, {
                          description: {
                            ru: slide.description?.ru ?? '',
                            en: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="tutorial-editor__controls">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => moveSlide(index, -1)}
                      disabled={index === 0}
                      aria-label={c.earlier}
                    >
                      ↑
                    </button>
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => moveSlide(index, 1)}
                      disabled={index === draft.tutorial!.length - 1}
                      aria-label={c.later}
                    >
                      ↓
                    </button>
                    <button
                      className="icon-button icon-button--danger"
                      type="button"
                      onClick={() => removeSlide(index)}
                      aria-label={c.remove}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="admin-empty">{c.noPhotos}</p>
          )}
        </section>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="modal-actions">
          <button className="button secondary" type="button" onClick={discardAndClose}>
            {c.cancel}
          </button>
          <button className="button" type="button" onClick={submit} disabled={uploading}>
            {c.save}
          </button>
        </div>
      </div>
    </Modal>
  )
}
