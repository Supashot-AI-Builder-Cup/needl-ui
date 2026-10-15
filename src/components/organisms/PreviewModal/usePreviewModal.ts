import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import { prefersReducedMotion } from '../../../lib/motion'
import { createTimerBag } from '../../../lib/timers'
import { useCheckRunner } from './useCheckRunner'

/** entering: mounted, not shown yet · open: shown · closing: exit animation */
export type Visibility = 'entering' | 'open' | 'closing'

const CLOSE_MS = 320
const COMPLETE_DELAY_MS = 200

interface Options {
  stepCount: number
  /** Called after the exit animation; the parent should unmount the modal. */
  onClose: () => void
  /** Called once every step has finished. */
  onComplete: () => void
}

export function usePreviewModal({ stepCount, onClose, onComplete }: Options) {
  const [visibility, setVisibility] = useState<Visibility>('entering')
  const [timers] = useState(createTimerBag)
  const runButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<Element | null>(null)
  const closing = useRef(false)
  const callbacks = useRef({ onClose, onComplete })
  const runner = useCheckRunner(stepCount, handleRunDone)

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
      second = requestAnimationFrame(() => {
        setVisibility('open')
        runButtonRef.current?.focus({ preventScroll: true })
      })
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

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

  function handleRunDone() {
    if (prefersReducedMotion()) {
      callbacks.current.onComplete()
      return
    }
    requestClose()
    timers.after(() => callbacks.current.onComplete(), COMPLETE_DELAY_MS)
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

  return {
    visibility,
    phase: runner.phase,
    faded: runner.faded,
    current: runner.current,
    done: runner.done,
    start: runner.start,
    sheetRef: runner.sheetRef,
    bodyRef: runner.bodyRef,
    runButtonRef,
    requestClose,
    onOverlayClick,
  }
}
