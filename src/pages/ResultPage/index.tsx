import { usePreferences } from '../../context/preferences/usePreferences'
import { ChipButton } from '../../components/atoms/ChipButton'
import { Icon } from '../../components/atoms/Icon'
import { Button } from '../../components/atoms/Button'
import { Disclaimer } from '../../components/molecules/Disclaimer'
import { StatusMessage } from '../../components/molecules/StatusMessage'
import { CheckSection } from '../../components/organisms/CheckSection'
import { SaferStores } from '../../components/organisms/SaferStores'
import { SellerQuestions } from '../../components/organisms/SellerQuestions'
import { VerdictCard } from '../../components/organisms/VerdictCard'
import { ResultTemplate } from '../../components/templates/ResultTemplate'
import { useResultPage } from './useResultPage'

export function ResultPage() {
  const { t } = usePreferences()
  const page = useResultPage()

  if (page.status === 'missing') {
    return (
      <StatusMessage title={t('resultMissing')} text={t('resultMissingHint')}>
        <Button variant="primary" block onClick={page.goHome}>
          {t('another')}
        </Button>
      </StatusMessage>
    )
  }
  if (page.status === 'error' && page.errorText) {
    return (
      <StatusMessage title={t('resultError')} text={t(page.errorText)}>
        <Button variant="primary" block onClick={page.retry}>
          {t('tryAgain')}
        </Button>
        <Button variant="link" onClick={page.goHome}>
          {t('another')}
        </Button>
      </StatusMessage>
    )
  }
  if (!page.result) {
    return <StatusMessage busy title={t('resultLoading')} />
  }

  return (
    <ResultTemplate
      actions={
        <>
          <ChipButton onClick={page.goHome}>
            <Icon name="chevronLeft" strokeWidth={1.9} />
            {t('back')}
          </ChipButton>
          <ChipButton className="sharebtn" onClick={page.share}>
            <Icon name="share" strokeWidth={1.8} />
            {t('share')}
          </ChipButton>
        </>
      }
      aside={
        <>
          <VerdictCard productView={page.result} counts={page.counts} onCheckAnother={page.goHome} />
          <Disclaimer text={t('disc')} />
        </>
      }
    >
      {page.sections.map(({ group, title, icon }) => (
        <CheckSection
          key={group.section}
          title={title}
          icon={icon}
          group={group}
          open={!!page.openSections[group.section]}
          onToggle={() => page.toggleSection(group.section)}
          openChecks={page.openChecks}
          onToggleCheck={page.toggleCheck}
        />
      ))}
      <SaferStores stores={page.result.stores} />
      <SellerQuestions questions={page.questions} onCopy={page.copyQuestion} />
    </ResultTemplate>
  )
}
