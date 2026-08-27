import { cleanup, render, screen } from '@testing-library/react'
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

  it('authenticates, reorders actions, and saves the complete document', async () => {
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
    await screen.findByRole('tab', { name: /Действия/ })

    await user.click(screen.getAllByRole('button', { name: 'Переместить ниже' })[0])
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }))

    expect(savedBodies).toHaveLength(1)
    const saved = JSON.parse(savedBodies[0]) as typeof dailyPlaybook
    expect(saved.actions[0].id).toBe(dailyPlaybook.actions[1].id)
    expect(saved.actions[1].id).toBe(dailyPlaybook.actions[0].id)
  })
})
