import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import { AppProvider } from './state/AppContext'

function renderApp(route = '/') {
  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  )
}

describe('core application behavior', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('ships Russian by default and switches the entire shell to English', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Смена уже идёт' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Переключить на английский' }))
    expect(screen.getByRole('heading', { level: 1, name: 'The shift is already moving' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('persists checklist completion across remounts', async () => {
    const user = userEvent.setup()
    const first = renderApp('/today')
    const checkbox = screen.getAllByRole('checkbox')[0]
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    first.unmount()

    renderApp('/today')
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })

  it('exposes unverified Survival Battle clock configuration', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: /Настройки времени/i }))
    expect(screen.getByRole('dialog', { name: 'Серверные часы' })).toBeInTheDocument()
    expect(screen.getByText(/не подтверждает UTC/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий день цикла (1–7)')).toBeInTheDocument()
  })

  it('resets the visible cycle when time crosses midnight UTC', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-27T23:59:59Z'))
    renderApp('/today')
    const before = screen.getAllByRole('checkbox')[0]
    fireEvent.click(before)
    expect(before).toBeChecked()
    act(() => {
      vi.advanceTimersByTime(2_000)
    })
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    vi.useRealTimers()
  })
})
