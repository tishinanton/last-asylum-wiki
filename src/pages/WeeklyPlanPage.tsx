import { AlertTriangle, ArrowRight, Link2Off } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { phaseNames, themeNames } from '../data/checklist'
import { weeklyOverlaps } from '../data/research'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'

export function WeeklyPlanPage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page reading-page">
      <PageHeader
        title={t('weeklyTitle')}
        lead={t('weeklyLead')}
        meta={locale === 'ru' ? 'Совет S1, не игровая связь' : 'S1 advice, not a game link'}
      />

      <section className="independence-statement">
        <Link2Off aria-hidden="true" />
        <div>
          <h2>{t('notLinked')}</h2>
          <p>{t('notLinkedBody')}</p>
        </div>
      </section>

      <section className="guide-section">
        <div className="section-heading">
          <h2>{t('overlapRules')}</h2>
        </div>
        <div className="overlap-ledger">
          {weeklyOverlaps.map(([phaseId, themeId, actions], index) => (
            <div className="overlap-row" key={`${phaseId}-${themeId}`}>
              <span className="overlap-day">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <small>{phaseId}</small>
                <strong>{localize(locale, phaseNames[phaseId])}</strong>
              </div>
              <ArrowRight aria-hidden="true" />
              <div>
                <small>{themeId}</small>
                <strong>{localize(locale, themeNames[themeId])}</strong>
              </div>
              <p>{localize(locale, actions)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="warning-strip major">
        <AlertTriangle aria-hidden="true" />
        <span>
          {locale === 'ru'
            ? 'Пороговые единицы различаются: 1 плод Ворона в Дуэли против каждых 10 в Битве; 660 противоядия против 1 950. Всегда сверяйте обе формулы.'
            : 'Threshold units differ: 1 Raven Fruit in Duel versus every 10 in Battle; 660 Antitoxin versus 1,950. Always check both formulas.'}
        </span>
      </section>

      <section className="field-procedure">
        <div>
          <span>1</span>
          <p>{locale === 'ru' ? 'После сброса сверить фазу Дуэли и день цикла Битвы.' : 'After reset, confirm the Duel phase and Battle Day 1–7.'}</p>
        </div>
        <div>
          <span>2</span>
          <p>{locale === 'ru' ? 'Перед расходом открыть Битву и проверить активную тему.' : 'Before spending, open Battle and check its active theme.'}</p>
        </div>
        <div>
          <span>3</span>
          <p>{locale === 'ru' ? 'Показать две формулы очков; не складывать их в общий итог.' : 'Show two scoring formulas; never merge them into one total.'}</p>
        </div>
        <div>
          <span>4</span>
          <p>{locale === 'ru' ? 'До сброса забрать награды обоих независимых событий.' : 'Claim rewards from both independent events before reset.'}</p>
        </div>
      </section>

      <Link className="button primary inline-action" to="/today">
        {t('backToToday')} <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </div>
  )
}
