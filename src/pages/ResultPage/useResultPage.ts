import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { IconName } from '../../components/atoms/Icon'
import { useCheck } from '../../context/check/useCheck'
import { usePreferences } from '../../context/preferences/usePreferences'
import { useClipboard } from '../../hooks/useClipboard'
import { useVerificationJob } from '../../hooks/useVerificationJob'
import type { TextKey } from '../../i18n'
import { groupChecks } from '../../lib/checks'
import { countBySeverity, FLAG_SEVERITIES } from '../../lib/severity'
import { buildShareText } from '../../lib/shareText'
import type { SectionKey } from '../../types/domain'

const SECTION_META: Record<SectionKey, { title: TextKey; icon: IconName }> = {
  store: { title: 'secStore', icon: 'store' },
  listing: { title: 'secListing', icon: 'listing' },
  reviews: { title: 'secReviews', icon: 'reviews' },
}

export function useResultPage() {
  const { jobId = '' } = useParams()
  const { getResult } = useCheck()
  const { t, pick } = usePreferences()
  const { copy } = useClipboard()
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({})
  // The first check's evidence starts open, like the prototype.
  const [openChecks, setOpenChecks] = useState<Record<number, boolean>>({ 0: true })

  // Right after a check the result is already in memory; otherwise (history, refresh) ask the API.
  const cached = getResult(jobId)
  const { job, error } = useVerificationJob(cached ? null : jobId)
  const result = cached ?? job?.verification ?? null
  const status: 'loading' | 'ready' | 'missing' = result
    ? 'ready'
    : error || job?.status === 'failed'
      ? 'missing'
      : 'loading'

  const counts = result ? countBySeverity(result.checks) : {}
  const sections = result
    ? groupChecks(result.checks).map((group) => ({
        group,
        title: t(SECTION_META[group.section].title),
        icon: SECTION_META[group.section].icon,
      }))
    : []

  const toggleSection = (key: SectionKey) => setOpenSections((s) => ({ ...s, [key]: !s[key] }))
  const toggleCheck = (index: number) => setOpenChecks((s) => ({ ...s, [index]: !s[index] }))
  const goHome = () => navigate('/')

  const share = async () => {
    if (!result) return
    const text = buildShareText({
      name: result.displayName,
      verdict: result.product.verdict === 'high' ? t('high') : t('safe'),
      score: result.product.score,
      counts: FLAG_SEVERITIES.filter((k) => counts[k]).map((k) => `${counts[k]} ${t(k)}`),
      link: result.source.url,
    })
    try {
      if (navigator.share) {
        await navigator.share({ title: 'needl', text })
        return
      }
    } catch (e) {
      // User closed the share sheet: nothing else to do.
      if (e instanceof Error && e.name === 'AbortError') return
    }
    await copy(text, t('shared'))
  }

  const copyQuestion = (index: number) => {
    if (result) copy(pick(result.questions[index]))
  }

  return {
    status,
    result,
    counts,
    sections,
    questions: result ? result.questions.map(pick) : [],
    openSections,
    openChecks,
    toggleSection,
    toggleCheck,
    goHome,
    share,
    copyQuestion,
  }
}
