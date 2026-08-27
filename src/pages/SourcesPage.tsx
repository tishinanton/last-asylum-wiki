import { ExternalLink, FileWarning, ShieldQuestion } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { sources, verificationBacklog } from '../data/research'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'

export function SourcesPage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page reading-page">
      <PageHeader
        title={t('sourcesTitle')}
        lead={t('sourcesLead')}
        meta={t('accessDate')}
      />

      <section className="source-ledger">
        {sources.map((source) => (
          <article key={source.id} className="source-record">
            <div className="source-id">{source.id}</div>
            <div className="source-body">
              <h2>{source.name}</h2>
              <p>{localize(locale, source.supports)}</p>
              <span>{localize(locale, source.type)}</span>
            </div>
            <div className={`confidence-stamp ${source.confidence}`}>
              {t(source.confidence === 'high' ? 'confidenceHigh' : source.confidence === 'medium' ? 'confidenceMedium' : 'confidenceLow')}
            </div>
            <a href={source.url} target="_blank" rel="noreferrer" aria-label={`${t('source')} ${source.id}`}>
              <ExternalLink aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>

      <section className="verification-section">
        <div className="section-heading">
          <h2>{t('verificationBacklog')}</h2>
          <p>{locale === 'ru' ? 'Снимок из игры должен сохранять версию, язык, регион, сервер и дату.' : 'In-game evidence must retain version, language, region, server, and date.'}</p>
        </div>
        <div className="verification-list">
          {verificationBacklog.map((item) => (
            <article key={item.id}>
              <span className={`priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
              <div>
                <small>{item.id}</small>
                <h3>{localize(locale, item.claim)}</h3>
                <p>{localize(locale, item.reason)}</p>
              </div>
              {item.priority === 'P0' ? <FileWarning aria-hidden="true" /> : <ShieldQuestion aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
