import { AlertTriangle, CheckCircle2, ExternalLink, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ScoreTable } from '../components/ScoreTable'
import { alliancePhases, allianceRequirements, raidSoldierRows } from '../data/research'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'

export function AllianceDuelPage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page reading-page">
      <PageHeader
        title={t('allianceTitle')}
        lead={t('allianceLead')}
        meta="00:00 UTC · S1"
      />

      <div className="fact-line">
        <CheckCircle2 aria-hidden="true" />
        <p>
          {locale === 'ru'
            ? 'Понедельник–суббота, одна 24-часовая фаза в сутки. Воскресенье — подготовка, отдельная фаза очков не описана.'
            : 'Monday–Saturday, one 24-hour phase per day. Sunday is preparation; no separate scoring phase is documented.'}
        </p>
      </div>

      <section className="guide-section">
        <div className="section-heading">
          <h2>{t('requirement')}</h2>
        </div>
        <ul className="requirement-list">
          {allianceRequirements.map((item) => (
            <li key={item.id}>
              <span className={`status-marker ${item.status}`} aria-hidden="true" />
              <code>{item.id}</code>
              <p>{localize(locale, item.label)}</p>
            </li>
          ))}
        </ul>
        <div className="warning-strip">
          <AlertTriangle aria-hidden="true" />
          <span>
            {locale === 'ru'
              ? 'Формула подбора, вес победных очков фаз и правило ничьей не опубликованы.'
              : 'The matchmaking formula, phase winning-point weights, and tie-break rule are unpublished.'}
          </span>
        </div>
      </section>

      <section className="guide-section">
        <div className="section-heading">
          <h2>{t('schedule')}</h2>
        </div>
        <div className="phase-tape">
          {alliancePhases.map((phase) => (
            <a key={phase.id} href={`#${phase.id.toLowerCase()}`}>
              <span>0{phase.dayNumber}</span>
              <small>{localize(locale, phase.day)}</small>
              <strong>{localize(locale, phase.title)}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="guide-section score-ledger">
        <div className="section-heading">
          <h2>{t('scoring')}</h2>
          <p>{locale === 'ru' ? 'Точные значения S1; дата доступа 2026-08-27.' : 'Exact S1 values; accessed 2026-08-27.'}</p>
        </div>
        {alliancePhases.map((phase) => (
          <div key={phase.id} className="phase-record">
            <ScoreTable table={phase} />
            <p className="strategy-note"><strong>{t('strategy')}:</strong> {localize(locale, phase.strategy)}</p>
            {phase.id === 'AD-D6-RAID' && (
              <div className="raid-table">
                <h4>{locale === 'ru' ? 'Очки за солдат в Рейде' : 'Raid soldier points'}</h4>
                <p className="mobile-table-hint">{t('mobileTableHint')}</p>
                <div className="table-scroll" role="region" aria-label={locale === 'ru' ? 'Очки за солдат в Рейде' : 'Raid soldier points'}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{locale === 'ru' ? 'Уровень' : 'Level'}</th>
                        <th scope="col">{locale === 'ru' ? 'Парный матч' : 'Matched opponent'}</th>
                        <th scope="col">{locale === 'ru' ? 'Другой бой' : 'Other fight'}</th>
                        <th scope="col">{locale === 'ru' ? 'Потерян' : 'Lost'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {raidSoldierRows.map((row) => (
                        <tr key={row.level}>
                          <th scope="row">{row.level}</th>
                          <td className="numeric">+{row.matched}</td>
                          <td className="numeric">+{row.other}</td>
                          <td className="numeric">+{row.lost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="reward-band">
        <ShieldAlert aria-hidden="true" />
        <div>
          <h2>{t('rewards')}</h2>
          <p>
            {locale === 'ru'
              ? 'S1 перечисляет ежедневные награды за прогресс, рейтинг и победу, а также еженедельные награды за победу и поражение. Точные пороги и содержимое не подтверждены текстом.'
              : 'S1 lists Daily Milestone, Ranking, and Victory rewards plus Weekly Alliance Victory and Defeat rewards. Exact thresholds and contents are not text-verified.'}
          </p>
        </div>
        <a href="https://lastasylumplague.com/events/alliance-duel/" target="_blank" rel="noreferrer">
          S1 <ExternalLink aria-hidden="true" size={16} />
        </a>
      </section>
    </div>
  )
}
