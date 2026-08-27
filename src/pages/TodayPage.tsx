import { EventStatusBoard } from '../components/EventStatusBoard'
import { PageHeader } from '../components/PageHeader'
import { TodayChecklist } from '../components/TodayChecklist'
import { translate } from '../i18n'
import { useApp } from '../state/app-context'

export function TodayPage() {
  const { state } = useApp()
  const locale = state.preferences.locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <div className="page">
      <PageHeader
        title={t('checklistTitle')}
        lead={t('checklistLead')}
        meta={locale === 'ru' ? 'Состояние хранится только на этом устройстве' : 'State is stored on this device only'}
      />
      <EventStatusBoard />
      <TodayChecklist />
    </div>
  )
}
