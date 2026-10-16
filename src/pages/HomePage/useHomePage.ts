import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCheck } from '../../context/check/useCheck'
import { useDraft } from '../../context/draft/useDraft'
import { usePreferences } from '../../context/preferences/usePreferences'
import type { TextKey } from '../../i18n'
import { requestErrorText } from '../../services/api/errors'
import { buildScreenshotForm } from '../../services/api/screenshotForm'
import { createLinkJob, createScreenshotJob, toApiLocale } from '../../services/api/verificationJobs'
import type { VerificationResult } from '../../types/api'
import type { Source } from '../../types/domain'

interface ActiveJob {
  jobId: string
  source: Source
}

export function useHomePage() {
  const { tab, setTab, uploads, extras } = useDraft()
  const { history, saveResult, refreshHistory, historyError, hasMoreHistory, loadingMoreHistory, loadMoreHistory } = useCheck()
  const { lang } = usePreferences()
  const navigate = useNavigate()
  const [active, setActive] = useState<ActiveJob | null>(null)

  useEffect(() => {
    void refreshHistory().catch(() => {})
  }, [refreshHistory])

  const submitLink = async (url: string): Promise<TextKey | null> => {
    try {
      const job = await createLinkJob(url, toApiLocale(lang))
      setActive({ jobId: job.id, source: 'link' })
      return null
    } catch (error) {
      return requestErrorText(error, 'link')
    }
  }

  const continueShots = async (): Promise<TextKey | null> => {
    try {
      const form = await buildScreenshotForm(uploads, extras, toApiLocale(lang))
      const job = await createScreenshotJob(form)
      setActive({ jobId: job.id, source: 'shots' })
      return null
    } catch (error) {
      return requestErrorText(error, 'shots')
    }
  }

  const completeCheck = (jobId: string, result: VerificationResult) => {
    saveResult(result)
    navigate(`/result/${jobId}`)
  }

  const switchToScreenshots = () => {
    setActive(null)
    setTab('shots')
  }

  return {
    tab,
    setTab,
    active,
    closeModal: () => setActive(null),
    submitLink,
    continueShots,
    completeCheck,
    switchToScreenshots,
    openHistory: (index: number) => navigate(`/history/${history[index].verificationId}`),
    historyCards: history.map(({ name, image, price, score, verdict }) => ({ name, image, price, score, verdict })),
    historyError,
    refreshHistory,
    hasMoreHistory,
    loadingMoreHistory,
    loadMoreHistory,
  }
}
