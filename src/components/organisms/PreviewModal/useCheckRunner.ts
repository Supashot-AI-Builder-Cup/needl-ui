import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../../lib/motion'
import { createTimerBag } from '../../../lib/timers'

/** preview: product card · scanning: scan-line sweep · checking: step log */
export type RunPhase = 'preview' | 'scanning' | 'checking'

const SCAN_MS = 1050
const FADE_MS = 200
const STEP_MS = 600
const STEP_MS_REDUCED = 160
const DONE_MS = 650
const DONE_MS_REDUCED = 100
const RESIZE_MS = 750

/** Drives the mock check: scan the preview, swap to the log, tick through each step. */
export function useCheckRunner(stepCount: number, onDone: () => void) {
  const [phase, setPhase] = useState<RunPhase>('preview')
  const [faded, setFaded] = useState(false)
  const [current, setCurrent] = useState(0)
  const [timers] = useState(createTimerBag)
  const sheetRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const startHeight = useRef(0)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => () => timers.clear(), [timers])

  const start = () => {
    if (phase !== 'preview') return
    const reduced = prefersReducedMotion()
    const stepMs = reduced ? STEP_MS_REDUCED : STEP_MS

    const tick = (i: number) => {
      setCurrent(i)
      if (i < stepCount) timers.after(() => tick(i + 1), stepMs)
      else timers.after(() => onDoneRef.current(), reduced ? DONE_MS_REDUCED : DONE_MS)
    }

    setPhase('scanning')
    timers.after(
      () => {
        setFaded(true)
        timers.after(
          () => {
            startHeight.current = sheetRef.current?.offsetHeight ?? 0
            setPhase('checking')
            tick(0)
          },
          reduced ? 0 : FADE_MS,
        )
      },
      reduced ? 0 : SCAN_MS,
    )
  }

  // After the swap: grow the sheet from its old size to the log's size, then fade the log in.
  useLayoutEffect(() => {
    if (phase !== 'checking') return
    const sheet = sheetRef.current
    if (!sheet) return
    sheet.style.transition = 'none'
    sheet.style.height = 'auto'
    const target = sheet.offsetHeight
    sheet.classList.remove('checking')
    sheet.style.height = `${startHeight.current}px`
    sheet.getBoundingClientRect() // force layout so the start size is applied before animating
    sheet.style.transition = ''
    sheet.classList.add('checking')
    sheet.style.height = `${target}px`
    timers.after(() => {
      sheet.style.height = ''
    }, RESIZE_MS)
    const raf = requestAnimationFrame(() => setFaded(false))
    return () => cancelAnimationFrame(raf)
  }, [phase, timers])

  // Keep the running step visible when the log scrolls.
  useEffect(() => {
    if (phase !== 'checking') return
    bodyRef.current?.querySelector(`[data-step="${current}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [phase, current])

  return {
    phase,
    faded,
    current,
    done: phase === 'checking' && current >= stepCount,
    start,
    cancel: timers.clear,
    sheetRef,
    bodyRef,
  }
}
