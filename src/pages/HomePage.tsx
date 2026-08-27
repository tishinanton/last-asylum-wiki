import { ArrowRight, CircleAlert, Crosshair, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EventStatusBoard } from '../components/EventStatusBoard'
import { TodayChecklist } from '../components/TodayChecklist'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'
import { alliancePhases, verificationBacklog } from '../data/research'

export function HomePage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page home-page">
      <div className="home-intro">
        <div>
          <h1>{t('overviewTitle')}</h1>
          <p>{t('overviewLead')}</p>
        </div>
        <span className="live-indicator"><span /> {t('statusLive')}</span>
      </div>

      <div className="operations-deck">
        <EventStatusBoard />
        <TodayChecklist compact />
      </div>

      <div className="home-action">
        <Link className="button primary" to="/today">
          {t('openChecklist')}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
        <p><Crosshair aria-hidden="true" /> {t('independentOverlapHelp')}</p>
      </div>

      <section className="week-strip">
        <div className="section-heading">
          <h2>{t('weekAtGlance')}</h2>
        </div>
        <ol>
          {alliancePhases.map((phase) => (
            <li key={phase.id}>
              <span>0{phase.dayNumber}</span>
              <div>
                <small>{localize(locale, phase.day)}</small>
                <strong>{localize(locale, phase.title)}</strong>
              </div>
            </li>
          ))}
          <li className="sunday-slot">
            <span>—</span>
            <div>
              <small>{locale === 'ru' ? 'Воскресенье' : 'Sunday'}</small>
              <strong>{t('preparation')}</strong>
            </div>
          </li>
        </ol>
      </section>

      <section className="evidence-band">
        <div className="evidence-symbol" aria-hidden="true">
          <ShieldCheck />
          <span>{verificationBacklog.filter((item) => item.priority === 'P0').length}</span>
        </div>
        <div>
          <h2>{t('evidenceTitle')}</h2>
          <p>{t('evidenceLead')}</p>
        </div>
        <Link to="/sources">
          <CircleAlert aria-hidden="true" size={18} />
          {t('verificationBacklog')}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </div>
  )
}
