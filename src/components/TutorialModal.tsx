import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import type { ChecklistTask, Locale } from '../types'

interface TutorialModalProps {
  task: ChecklistTask
  locale: Locale
  onClose: () => void
}

const copy = {
  ru: {
    close: 'Закрыть инструкцию',
    previous: 'Предыдущее фото',
    next: 'Следующее фото',
    slide: 'Шаг',
  },
  en: {
    close: 'Close tutorial',
    previous: 'Previous photo',
    next: 'Next photo',
    slide: 'Step',
  },
} as const

export function TutorialModal({ task, locale, onClose }: TutorialModalProps) {
  const c = copy[locale]
  const slides = task.tutorial ?? []
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setIndex((current) => Math.max(0, current - 1))
      }
      if (event.key === 'ArrowRight') {
        setIndex((current) => Math.min(slides.length - 1, current + 1))
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [slides.length])

  if (!slide) return null

  const description = slide.description?.[locale]

  return (
    <Modal title={task.label[locale]} closeLabel={c.close} onClose={onClose} wide>
      <div className="tutorial-carousel">
        <div className="tutorial-carousel__stage">
          <img
            src={slide.imageUrl}
            alt={description || `${c.slide} ${index + 1}`}
          />
        </div>
        <div className="tutorial-carousel__caption" aria-live="polite">
          <strong>
            {c.slide} {index + 1} / {slides.length}
          </strong>
          {description ? <p>{description}</p> : null}
        </div>
        {slides.length > 1 ? (
          <div className="tutorial-carousel__controls">
            <button
              className="button secondary"
              type="button"
              onClick={() => setIndex((current) => current - 1)}
              disabled={index === 0}
            >
              ← {c.previous}
            </button>
            <div className="tutorial-carousel__steps" aria-hidden="true">
              {slides.map((item, slideIndex) => (
                <span key={item.id} className={slideIndex === index ? 'is-active' : ''} />
              ))}
            </div>
            <button
              className="button secondary"
              type="button"
              onClick={() => setIndex((current) => current + 1)}
              disabled={index === slides.length - 1}
            >
              {c.next} →
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
