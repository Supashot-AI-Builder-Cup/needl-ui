import { usePreferences } from '../../context/preferences/usePreferences'
import { Button } from '../../components/atoms/Button'
import { StatusMessage } from '../../components/molecules/StatusMessage'
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
          {page.historyError && (
            <StatusMessage text={t('historyError')}>
              <Button variant="link" onClick={() => void page.refreshHistory().catch(() => {})}>
                {t('retry')}
              </Button>
            </StatusMessage>
          )}
          <HistoryList
            items={page.historyCards}
            onOpen={page.openHistory}
            hasMore={page.hasMoreHistory}
            loadingMore={page.loadingMoreHistory}
            onLoadMore={() => void page.loadMoreHistory().catch(() => {})}
          />
        </>
      ) : (
        <ScreenshotUploader onContinue={page.continueShots} />
      )}
      {page.active && (
        <PreviewModal
          key={page.active.jobId}
          jobId={page.active.jobId}
          source={page.active.source}
          onClose={page.closeModal}
          onComplete={page.completeCheck}
          onUseScreenshots={page.switchToScreenshots}
        />
      )}
    </HomeTemplate>
  )
}
