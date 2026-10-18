import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { IconName } from '../../components/atoms/Icon'
import { useCheck } from '../../context/check/useCheck'
import { usePreferences } from '../../context/preferences/usePreferences'
import { useClipboard } from '../../hooks/useClipboard'
import { format, type TextKey } from '../../i18n'
import { groupChecks } from '../../lib/checks'
import { ZONE_LOOK, zoneForScore } from '../../lib/gauge'
import { countBySeverity, FLAG_SEVERITIES } from '../../lib/severity'
import { buildShareText, resultUrl } from '../../lib/shareText'
import { isNotFound, jobErrorText, requestErrorText } from '../../services/api/errors'
import type { SectionKey } from '../../types/domain'
import { useVerification } from '../../hooks/useVerification'
import { useVerificationJob } from '../../hooks/useVerificationJob'

const SECTION_META: Record<SectionKey, { title: TextKey; short: TextKey; icon: IconName }> = {
  store: { title: 'secStore', short: 'secStoreShort', icon: 'store' },
  listing: { title: 'secListing', short: 'secListingShort', icon: 'listing' },
  reviews: { title: 'secReviews', short: 'secReviewsShort', icon: 'reviews' },
}

/** The screenshot that fills each section, for the "add screenshots" hint. */
const SECTION_SHOT: Record<SectionKey, TextKey> = {
  store: 'shotStore',
  listing: 'shotDesc',
  reviews: 'shotReviews',
}

export function useResultPage() {
  const { jobId = '', verificationId = '' } = useParams()
  const { getResult } = useCheck()
  const { t, pick, lang } = usePreferences()
  const { copy } = useClipboard()
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({})
  // The first check's evidence starts open, like the prototype.
  const [openChecks, setOpenChecks] = useState<Record<number, boolean>>({ 0: true })

  // Right after a check the result is already in memory; otherwise (history, refresh) ask the API.
  const cached = getResult(verificationId)
  const { job, error: jobError, retry: retryJob } = useVerificationJob(jobId || null)
  const { result: fetched, error: verificationError, retry: retryVerification } = useVerification(cached ? null : verificationId || null)
  const error = jobId ? jobError : verificationError
  const retry = jobId ? retryJob : retryVerification
  const result = job?.verification ?? cached ?? fetched
  // missing: the result does not exist (any more). error: it could not be loaded right now.
  let status: 'loading' | 'ready' | 'missing' | 'error' = 'loading'
  if (result) status = 'ready'
  else if (!jobId && !verificationId) status = 'missing'
  else if (job?.status === 'failed') status = 'error'
  else if (job?.status === 'completed' && !job.verification) status = 'missing'
  else if (isNotFound(error)) status = 'missing'
  else if (error) status = 'error'
  const errorText: TextKey | null = status === 'error'
    ? jobId && job?.status === 'failed' && job.error
      ? jobErrorText(job.error.code)
      : requestErrorText(error, 'link')
    : null

  const counts = result ? countBySeverity(result.checks) : {}
  const sections = result
    ? groupChecks(result.checks).map((group) => ({
      group,
      title: t(SECTION_META[group.section].title),
      icon: SECTION_META[group.section].icon,
    }))
    : []

  // Sections with no check: the score counts them as risk, so say what is missing.
  const unchecked = sections.filter((s) => s.group.checks.length === 0)
  const list = (items: string[]) => new Intl.ListFormat(lang, { type: 'conjunction' }).format(items)
  let uncheckedNote: string | null = null
  if (result && unchecked.length) {
    uncheckedNote = format(t('vUnchecked'), { sections: list(unchecked.map((s) => t(SECTION_META[s.group.section].short))) })
    if (result.source.kind === 'screenshots') {
      const shots = list(unchecked.map((s) => t(SECTION_SHOT[s.group.section])))
      uncheckedNote += ` ${format(t('vAddShots'), { shots })}`
    }
  }

  const toggleSection = (key: SectionKey) => setOpenSections((s) => ({ ...s, [key]: !s[key] }))
  const toggleCheck = (index: number) => setOpenChecks((s) => ({ ...s, [index]: !s[index] }))
  const goHome = () => navigate('/')

  const share = async () => {
    if (!result) return
    const url = resultUrl(window.location.origin, result.id)
    const summary = {
      name: result.displayName,
      verdict: t(ZONE_LOOK[zoneForScore(result.product.score)].word),
      score: result.product.score,
      counts: FLAG_SEVERITIES.filter((k) => counts[k]).map((k) => `${counts[k]} ${t(k)}`),
    }
    try {
      if (navigator.share) {
        // The share sheet adds the link itself, so it is not repeated in the text.
        await navigator.share({ title: 'needl', text: buildShareText({ ...summary, link: null }), url })
        return
      }
    } catch (e) {
      // User closed the share sheet: nothing else to do.
      if (e instanceof Error && e.name === 'AbortError') return
    }
    await copy(buildShareText({ ...summary, link: url }), t('shared'))
  }

  const copyQuestion = (index: number) => {
    if (result) copy(pick(result.questions[index]))
  }

  return {
    status,
    errorText,
    retry,
    result,
    counts,
    sections,
    uncheckedNote,
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
