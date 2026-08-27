import { AlertTriangle, Clock3, ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ScoreTable } from '../components/ScoreTable'
import { checklistSeed, themeNames } from '../data/checklist'
import { survivalThemes } from '../data/research'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'

export function SurvivalBattlePage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page reading-page">
      <PageHeader
        title={t('survivalTitle')}
        lead={t('survivalLead')}
        meta={locale === 'ru' ? '00:00:00 · зона неизвестна' : '00:00:00 · zone unknown'}
      />

      <div className="warning-strip major">
        <AlertTriangle aria-hidden="true" />
        <span>{t('utcWarning')} {t('anchorWarning')}</span>
      </div>

      <section className="survival-rules">
        <div>
          <strong>12–20</strong>
          <span>{locale === 'ru' ? 'игроков схожего уровня' : 'similarly leveled players'}</span>
        </div>
        <div>
          <strong>{locale === 'ru' ? '6 × 4 ч' : '6 × 4h'}</strong>
          <span>{locale === 'ru' ? 'стадий ежедневно' : 'rounds every day'}</span>
        </div>
        <div>
          <Clock3 aria-hidden="true" />
          <span>{locale === 'ru' ? 'Новая случайная группа в 00:00:00 [S4]' : 'New random group at 00:00:00 [S4]'}</span>
        </div>
      </section>

      <section className="guide-section">
        <div className="section-heading">
          <h2>{t('schedule')}</h2>
          <p>{locale === 'ru' ? 'Опорная дата первого дня настраивается пользователем.' : 'The Day 1 anchor is user-configured.'}</p>
        </div>
        <p className="mobile-table-hint">{t('mobileTableHint')}</p>
        <div className="table-scroll calendar-table" role="region" aria-label={t('schedule')}>
          <table>
            <thead>
              <tr>
                <th scope="col">{t('cycleDay')}</th>
                {[1, 2, 3, 4, 5, 6].map((round) => (
                  <th scope="col" key={round}>{t('round')} {round}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checklistSeed.events['survival-battle'].cycle.map((entry) => (
                <tr key={entry.day}>
                  <th scope="row">{locale === 'ru' ? 'День' : 'Day'} {entry.day}</th>
                  {entry.themes.map((theme, index) => (
                    <td key={`${entry.day}-${index}`}>{localize(locale, themeNames[theme])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">
          {locale === 'ru'
            ? 'День 1 совпадает с днём 3, день 2 — с днём 7. Повторы сохранены как опубликовано в S2.'
            : 'Day 1 equals Day 3, and Day 2 equals Day 7. The repetitions are preserved as published by S2.'}
        </p>
      </section>

      <section className="guide-section score-ledger">
        <div className="section-heading">
          <h2>{t('scoring')}</h2>
          <p>S2 + S4 · 2026-08-27</p>
        </div>
        {survivalThemes.map((theme) => <ScoreTable key={theme.id} table={theme} />)}
      </section>

      <section className="medal-band">
        <div>
          <span>2</span>
          <strong>{locale === 'ru' ? 'Синий сундук' : 'Blue Chest'}</strong>
        </div>
        <div>
          <span>8</span>
          <strong>{locale === 'ru' ? 'Фиолетовый сундук' : 'Purple Chest'}</strong>
        </div>
        <div>
          <span>18</span>
          <strong>{locale === 'ru' ? 'Оранжевый сундук' : 'Orange Chest'}</strong>
        </div>
        <p>
          {locale === 'ru'
            ? 'Пороги медалей single-source [S2]. Незабранные награды могут прийти по почте, кроме медалей [S4].'
            : 'Medal thresholds are single-sourced [S2]. Unclaimed rewards may be mailed, except medals [S4].'}
        </p>
        <a href="https://lastasylumguides.com/2026/07/11/survival-battle-event/" target="_blank" rel="noreferrer">
          S2 <ExternalLink aria-hidden="true" size={16} />
        </a>
      </section>
    </div>
  )
}
