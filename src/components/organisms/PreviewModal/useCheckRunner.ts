import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { STEPS } from '../../../data/steps'
import { prefersReducedMotion } from '../../../lib/motion'
import { stepsDone } from '../../../lib/stepOutcome'
import { createTimerBag } from '../../../lib/timers'
import type { VerificationJob, VerificationResult } from '../../../types/api'

/** preview: product card · scanning: scan-line sweep · checking: step log */
export type RunPhase = 'preview' | 'scanning' | 'checking'

const SCAN_MS = 1050
const FADE_MS = 200
// Steps are revealed one at a time, even when a poll jumps several steps ahead.
const STEP_REVEAL_MS = 260
const DONE_MS = 650
const RESIZE_MS = 750

/** Shows the job's progress as the checking log after the user confirms the product. */
export function useCheckRunner(job: VerificationJob | null, onDone: (result: VerificationResult) => void) {
  const [phase, setPhase] = useState<RunPhase>('preview')
  const [faded, setFaded] = useState(false)
  // Number of log lines shown as done.
  const [shown, setShown] = useState(0)
  const [timers] = useState(createTimerBag)
  const sheetRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const startHeight = useRef(0)
  const onDoneRef = useRef(onDone)

  const result = job?.status === 'completed' ? job.verification : null
  const target = result ? STEPS.length : stepsDone(STEPS, job?.progress ?? 0)
  const done = result !== null && shown >= STEPS.length

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => () => timers.clear(), [timers])

  const start = () => {
    if (phase !== 'preview') return
    const reduced = prefersReducedMotion()
    setPhase('scanning')
    timers.after(
      () => {
        setFaded(true)
        timers.after(
          () => {
            startHeight.current = sheetRef.current?.offsetHeight ?? 0
            setPhase('checking')
          },
          reduced ? 0 : FADE_MS,
        )
      },
      reduced ? 0 : SCAN_MS,
    )
  }

  // Reveal the next line until the log catches up with the job.
  useEffect(() => {
    if (phase !== 'checking' || shown >= target) return
    const id = window.setTimeout(() => setShown((n) => n + 1), prefersReducedMotion() ? 0 : STEP_REVEAL_MS)
    return () => window.clearTimeout(id)
  }, [phase, shown, target])

  // Every line done and the result in hand: hand it over after a short pause.
  useEffect(() => {
    if (phase !== 'checking' || !done || !result) return
    const id = window.setTimeout(() => onDoneRef.current(result), prefersReducedMotion() ? 100 : DONE_MS)
    return () => window.clearTimeout(id)
  }, [phase, done, result])

  // After the swap: grow the sheet from its old size to the log's size, then fade the log in.
  useLayoutEffect(() => {
    if (phase !== 'checking') return
    const sheet = sheetRef.current
    if (!sheet) return
    sheet.style.transition = 'none'
    sheet.style.height = 'auto'
    const height = sheet.offsetHeight
    sheet.classList.remove('checking')
    sheet.style.height = `${startHeight.current}px`
    sheet.getBoundingClientRect() // force layout so the start size is applied before animating
    sheet.style.transition = ''
    sheet.classList.add('checking')
    sheet.style.height = `${height}px`
    timers.after(() => {
      sheet.style.height = ''
    }, RESIZE_MS)
    const raf = requestAnimationFrame(() => setFaded(false))
    return () => cancelAnimationFrame(raf)
  }, [phase, timers])

  // Keep the running line visible when the log scrolls.
  useEffect(() => {
    if (phase !== 'checking') return
    bodyRef.current?.querySelector(`[data-step="${shown}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [phase, shown])

  return { phase, faded, shown, result, done, start, cancel: timers.clear, sheetRef, bodyRef }
}
