import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { dailyPlaybook } from '../data/daily-playbook'
import { AppProvider } from '../state/AppContext'
import { ChecklistDataProvider } from '../state/ChecklistDataContext'
import { AdminPage } from './AdminPage'

function response(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe('checklist administration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('groups entries by Duel day and edits an action in a modal', async () => {
    const savedBodies: string[] = []
    const serverData = { ...dailyPlaybook, revision: 1 }
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        if (url === '/api/checklist') return response(serverData)
        if (url === '/api/admin/session') return response({ authorized: false })
        if (url === '/api/admin/login') return response(null, 204)
        if (url === '/api/admin/checklist' && init?.method === 'PUT') {
          const body = String(init.body)
          savedBodies.push(body)
          return response(JSON.parse(body))
        }
        return response(null, 404)
      }),
    )

    const user = userEvent.setup()
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ChecklistDataProvider>
          <AppProvider>
            <AdminPage />
          </AppProvider>
        </ChecklistDataProvider>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Пароль'), 'temporary-password')
    await user.click(screen.getByRole('button', { name: 'Войти' }))
    await screen.findByRole('tab', { name: /День 1/ })

    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByText('Забрать подготовленные награды заданий «Сокол»')).toBeVisible()
    expect(
      within(panel).queryByText('Завершить подготовленные улучшения зданий'),
    ).not.toBeInTheDocument()

    await user.click(within(panel).getAllByRole('button', { name: 'Изменить' })[0])
    const dialog = screen.getByRole('dialog', { name: 'Действие' })
    const russianTitle = within(dialog).getByLabelText('Название на русском')
    await user.clear(russianTitle)
    await user.type(russianTitle, 'Обновлённое действие')
    await user.click(within(dialog).getByRole('button', { name: 'Сохранить действие' }))

    expect(within(panel).getByText('Обновлённое действие')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }))

    expect(savedBodies).toHaveLength(1)
    const saved = JSON.parse(savedBodies[0]) as typeof dailyPlaybook
    expect(saved.actions.find((action) => action.id === 'ad-d1-claim-falcon')?.label.ru).toBe(
      'Обновлённое действие',
    )
  })

  it('reorders actions only within the selected day', async () => {
    const savedBodies: string[] = []
    const serverData = { ...dailyPlaybook, revision: 1 }
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        if (url === '/api/checklist') return response(serverData)
        if (url === '/api/admin/session') return response({ authorized: true })
        if (url === '/api/admin/checklist' && init?.method === 'PUT') {
          const body = String(init.body)
          savedBodies.push(body)
          return response(JSON.parse(body))
        }
        return response(null, 404)
      }),
    )

    const user = userEvent.setup()
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ChecklistDataProvider>
          <AppProvider>
            <AdminPage />
          </AppProvider>
        </ChecklistDataProvider>
      </MemoryRouter>,
    )

    const panel = await screen.findByRole('tabpanel')
    await user.click(within(panel).getAllByRole('button', { name: 'Переместить ниже' })[0])
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }))

    const saved = JSON.parse(savedBodies[0]) as typeof dailyPlaybook
    const dayOne = saved.actions.filter((action) => action.phaseId === 'AD-D1-RAVEN')
    expect(dayOne[0].id).toBe('ad-d1-collect-grain')
    expect(dayOne[1].id).toBe('ad-d1-claim-falcon')
    expect(saved.actions[0].id).toBe(dailyPlaybook.actions[0].id)
  })

  it('preserves edits made while an earlier save is pending', async () => {
    const serverData = { ...dailyPlaybook, revision: 1 }
    let resolveSave: ((response: Response) => void) | undefined
    let submitted: typeof dailyPlaybook | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        if (url === '/api/checklist') return response(serverData)
        if (url === '/api/admin/session') return response({ authorized: true })
        if (url === '/api/admin/checklist' && init?.method === 'PUT') {
          submitted = JSON.parse(String(init.body)) as typeof dailyPlaybook
          return new Promise<Response>((resolve) => {
            resolveSave = resolve
          })
        }
        return response(null, 404)
      }),
    )

    const user = userEvent.setup()
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ChecklistDataProvider>
          <AppProvider>
            <AdminPage />
          </AppProvider>
        </ChecklistDataProvider>
      </MemoryRouter>,
    )

    const panel = await screen.findByRole('tabpanel')
    await user.click(within(panel).getAllByRole('button', { name: 'Переместить ниже' })[0])
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }))
    await user.click(within(panel).getAllByRole('button', { name: 'Переместить ниже' })[0])

    if (!submitted || !resolveSave) {
      throw new Error('The pending save request was not captured.')
    }
    resolveSave(response({ ...submitted, revision: 2 }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeEnabled(),
    )
  })
})
