import {
  BookOpenText,
  CalendarRange,
  ClipboardCheck,
  Database,
  Languages,
  Menu,
  RadioTower,
  Settings2,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { translate } from '../i18n'
import { useApp } from '../state/app-context'
import { SettingsDialog } from './SettingsDialog'

const navItems = [
  { to: '/', key: 'navOverview', icon: RadioTower },
  { to: '/today', key: 'navToday', icon: ClipboardCheck },
  { to: '/alliance-duel', key: 'navAlliance', icon: Shield },
  { to: '/survival-battle', key: 'navSurvival', icon: BookOpenText },
  { to: '/weekly-plan', key: 'navWeekly', icon: CalendarRange },
  { to: '/sources', key: 'navSources', icon: Database },
  { to: '/admin', key: 'navAdmin', icon: ShieldCheck },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  const { state, setLocale } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label={t('navOverview')}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            <strong>{t('productName')}</strong>
            <small>{t('productContext')}</small>
          </span>
        </NavLink>
        <div className="topbar-actions">
          <button
            className="utility-button"
            type="button"
            onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
            aria-label={t('switchLanguage')}
          >
            <Languages aria-hidden="true" size={17} />
            {t('languageCode')}
          </button>
          <button
            className="utility-button"
            type="button"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 aria-hidden="true" size={17} />
            <span className="utility-label">{t('settings')}</span>
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? t('closeNavigation') : t('openNavigation')}</span>
          </button>
        </div>
      </header>

      <aside className={menuOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <nav id="primary-navigation" aria-label={locale === 'ru' ? 'Основная навигация' : 'Primary navigation'}>
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-signal" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </aside>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
