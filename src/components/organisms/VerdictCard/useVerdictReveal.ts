import { useEffect, useRef, useState } from 'react'
import { GAUGE_TIMING } from '../../../lib/gauge'
import { prefersReducedMotion } from '../../../lib/motion'

/** Count the score up while the gauge needle swings, then fade in the verdict word. */
export function useVerdictReveal(score: number) {
  const [displayScore, setDisplayScore] = useState(() => (prefersReducedMotion() ? score : 0))
  const wordRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const { duration, delay } = GAUGE_TIMING
    const start = performance.now() + delay
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - start) / duration))
      const eased = 1 - Math.pow(1 - k, 3)
      setDisplayScore(Math.round(score * eased))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const fade = wordRef.current?.animate(
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 420, delay: duration - 100, easing: 'ease-out', fill: 'both' },
    )

    return () => {
      cancelAnimationFrame(raf)
      fade?.cancel()
    }
  }, [score])

  return { displayScore, wordRef }
}
