import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TutorialModal } from './TutorialModal'
import type { ChecklistTask } from '../types'

const task: ChecklistTask = {
  id: 'action-1',
  eventId: 'alliance-duel',
  phaseId: 'AD-D1-RAVEN',
  label: { ru: 'Открыть награды', en: 'Open rewards' },
  sourceIds: ['S1'],
  confidence: 'high',
  tutorial: [
    {
      id: 'slide-1',
      imageUrl: '/tutorial-media/one.webp',
      description: { ru: 'Первый экран', en: 'First screen' },
    },
    {
      id: 'slide-2',
      imageUrl: '/tutorial-media/two.webp',
      description: { ru: 'Второй экран', en: 'Second screen' },
    },
  ],
}

describe('tutorial modal', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('navigates the carousel and closes with Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<TutorialModal task={task} locale="ru" onClose={onClose} />)

    expect(screen.getByRole('img', { name: 'Первый экран' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: /Следующее фото/ }))
    expect(screen.getByRole('img', { name: 'Второй экран' })).toBeVisible()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
