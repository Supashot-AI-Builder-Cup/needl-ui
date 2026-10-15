import { usePreferences } from '../../context/preferences/usePreferences'
import { Tabs } from '../../components/molecules/Tabs'
import { ChecksOverview } from '../../components/organisms/ChecksOverview'
import { Hero } from '../../components/organisms/Hero'
import { HistoryList } from '../../components/organisms/HistoryList'
import { LinkForm } from '../../components/organisms/LinkForm'
import { PreviewModal } from '../../components/organisms/PreviewModal'
import { ScreenshotUploader } from '../../components/organisms/ScreenshotUploader'
import { HomeTemplate } from '../../components/templates/HomeTemplate'
import { useHomePage } from './useHomePage'

export function HomePage() {
  const { t } = usePreferences()
  const page = useHomePage()

  return (
    <HomeTemplate hero={<Hero />}>
      <Tabs
        items={[
          { value: 'link', label: t('tabLink') },
          { value: 'shots', label: t('tabShots') },
        ]}
        value={page.tab}
        onChange={page.setTab}
      />
      {page.tab === 'link' ? (
        <>
          <LinkForm onSubmit={page.submitLink} />
          <ChecksOverview />
          <HistoryList items={page.historyCards} onOpen={page.openHistory} />
        </>
      ) : (
        <ScreenshotUploader onContinue={page.continueShots} />
      )}
      {page.modalOpen && page.subject && page.productView && (
        <PreviewModal
          productView={page.productView}
          scenario={page.subject.scenario}
          steps={page.steps}
          dismissLabel={page.subject.source === 'shots' ? t('back') : t('change')}
          onClose={page.closeModal}
          onComplete={page.completeCheck}
        />
      )}
    </HomeTemplate>
  )
}
