import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminActionModal } from './AdminActionModal'
import type { ChecklistTask } from '../types'

const action: ChecklistTask = {
  id: 'action-1',
  eventId: 'alliance-duel',
  phaseId: 'AD-D1-RAVEN',
  label: { ru: 'Действие', en: 'Action' },
  sourceIds: ['S1'],
  confidence: 'high',
}

describe('admin action modal', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('uploads, describes, and saves an ordered tutorial slide', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ url: '/tutorial-media/example.webp' }),
      })),
    )
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(
      <AdminActionModal action={action} locale="ru" onClose={vi.fn()} onSave={onSave} />,
    )

    const file = new File(['image'], 'step.webp', { type: 'image/webp' })
    await user.upload(screen.getByLabelText('Добавить фото'), file)

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('img')).toHaveAttribute(
      'src',
      '/tutorial-media/example.webp',
    )
    await user.type(
      within(dialog).getByLabelText('Описание фото на русском (необязательно)'),
      'Откройте меню события',
    )
    await user.click(within(dialog).getByRole('button', { name: 'Сохранить действие' }))

    expect(onSave).toHaveBeenCalledOnce()
    expect(onSave.mock.calls[0][0].tutorial).toEqual([
      expect.objectContaining({
        imageUrl: '/tutorial-media/example.webp',
        description: { ru: 'Откройте меню события', en: '' },
      }),
    ])
  })

  it('removes a newly uploaded file when editing is cancelled', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => ({
      ok: true,
      status: init?.method === 'DELETE' ? 204 : 200,
      json: async () => ({ url: '/tutorial-media/discarded.webp' }),
    }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(
      <AdminActionModal action={action} locale="ru" onClose={vi.fn()} onSave={vi.fn()} />,
    )

    await user.upload(
      screen.getByLabelText('Добавить фото'),
      new File(['image'], 'step.webp', { type: 'image/webp' }),
    )
    await user.click(screen.getByRole('button', { name: 'Отмена' }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/tutorial-images/discarded.webp',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
