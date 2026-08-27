import { AlertTriangle } from 'lucide-react'
import { localize, translate } from '../i18n'
import { useApp } from '../state/app-context'
import type { ScoreTable as ScoreTableData } from '../types'

export function ScoreTable({ table }: { table: ScoreTableData }) {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <section className="score-section" id={table.id.toLowerCase()}>
      <div className="section-heading split-heading">
        <div>
          <span className="data-id">{table.id}</span>
          <h3>{localize(locale, table.title)}</h3>
        </div>
        <span className="source-chip">S1–S4</span>
      </div>
      {table.warning && (
        <div className="warning-strip">
          <AlertTriangle aria-hidden="true" size={19} />
          <span>{localize(locale, table.warning)}</span>
        </div>
      )}
      <p className="mobile-table-hint">{t('mobileTableHint')}</p>
      <div className="table-scroll" role="region" aria-label={localize(locale, table.title)}>
        <table>
          <thead>
            <tr>
              <th scope="col">{t('action')}</th>
              <th scope="col">{t('points')}</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((entry, index) => (
              <tr key={`${table.id}-${index}`}>
                <td>
                  {localize(locale, entry.action)}
                  {entry.note && <small className="row-note">{localize(locale, entry.note)}</small>}
                </td>
                <td className="numeric">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
