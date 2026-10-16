import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import { useVerificationJob } from '../../../hooks/useVerificationJob'
import type { TextKey } from '../../../i18n'
import { prefersReducedMotion } from '../../../lib/motion'
import { createTimerBag } from '../../../lib/timers'
import { jobErrorText, requestErrorText } from '../../../services/api/errors'
import type { VerificationResult } from '../../../types/api'
import { useCheckRunner } from './useCheckRunner'

/** entering: mounted, not shown yet · open: shown · closing: exit animation */
export type Visibility = 'entering' | 'open' | 'closing'

const CLOSE_MS = 320
const COMPLETE_DELAY_MS = 200

interface Options {
  jobId: string
  /** Called after the exit animation; the parent should unmount the modal. */
  onClose: () => void
  /** Called with the result once the job is completed and the log has finished. */
  onComplete: (jobId: string, result: VerificationResult) => void
}

export function usePreviewModal({ jobId, onClose, onComplete }: Options) {
  const [visibility, setVisibility] = useState<Visibility>('entering')
  const [timers] = useState(createTimerBag)
  const runButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<Element | null>(null)
  const closing = useRef(false)
  const callbacks = useRef({ onClose, onComplete })
  const { job, error: pollError } = useVerificationJob(jobId)
  const runner = useCheckRunner(job, handleRunDone)

  useBodyScrollLock()

  useEffect(() => {
    callbacks.current = { onClose, onComplete }
  })

  useEffect(() => () => timers.clear(), [timers])

  // Two frames so the browser paints the hidden state before the open transition.
  useEffect(() => {
    returnFocus.current = document.activeElement
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setVisibility('open'))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

  // Focus the confirm button once the product is there to confirm.
  const hasPreview = job?.preview != null
  useEffect(() => {
    if (hasPreview) runButtonRef.current?.focus({ preventScroll: true })
  }, [hasPreview])

  function requestClose() {
    if (closing.current) return
    closing.current = true
    runner.cancel()
    const el = returnFocus.current
    if (el instanceof HTMLElement && el.isConnected) el.focus({ preventScroll: true })
    if (prefersReducedMotion()) {
      callbacks.current.onClose()
      return
    }
    setVisibility('closing')
    timers.after(() => callbacks.current.onClose(), CLOSE_MS)
  }

  function handleRunDone(result: VerificationResult) {
    if (closing.current) return
    if (prefersReducedMotion()) {
      callbacks.current.onComplete(jobId, result)
      return
    }
    requestClose()
    timers.after(() => callbacks.current.onComplete(jobId, result), COMPLETE_DELAY_MS)
  }

  const closeRef = useRef<() => void>(() => {})
  useEffect(() => {
    closeRef.current = requestClose
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) requestClose()
  }

  let errorText: TextKey | null = null
  if (job?.status === 'failed') errorText = jobErrorText(job.error?.code ?? '')
  else if (pollError) errorText = requestErrorText(pollError, 'link')

  return {
    visibility,
    phase: runner.phase,
    faded: runner.faded,
    shown: runner.shown,
    result: runner.result,
    done: runner.done,
    preview: job?.preview ?? null,
    errorText,
    errorCode: job?.status === 'failed' ? (job.error?.code ?? null) : null,
    start: runner.start,
    sheetRef: runner.sheetRef,
    bodyRef: runner.bodyRef,
    runButtonRef,
    requestClose,
    onOverlayClick,
  }
}
