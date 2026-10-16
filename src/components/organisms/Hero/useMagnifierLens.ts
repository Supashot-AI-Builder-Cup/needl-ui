import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../../lib/motion'

const ZOOM = 1.5
// Shared start time so the lens keeps its path when the hero re-mounts.
const START = performance.now()

/**
 * Moves a magnifying glass over the title in a figure-eight and shows a
 * zoomed copy of the title inside the glass.
 */
export function useMagnifierLens() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const cloneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const lens = lensRef.current
    const glass = glassRef.current
    const clone = cloneRef.current
    if (!title || !lens || !glass || !clone) return

    const reduced = prefersReducedMotion()
    let raf = 0
    const frame = (now: number) => {
      const w = title.offsetWidth
      const h = title.offsetHeight
      const lensSize = lens.offsetWidth
      const glassSize = glass.clientWidth
      clone.style.width = `${w}px`
      const t = reduced ? 2.2 : ((now - START) / 1000) * 0.5
      const x = w / 2 + w * 0.34 * Math.sin(t)
      const y = h / 2 + h * 0.32 * Math.sin(2 * t + 0.5)
      lens.style.transform = `translate(${x - lensSize / 2}px,${y - lensSize / 2}px)`
      clone.style.transform = `translate(${glassSize / 2 - x * ZOOM}px,${glassSize / 2 - y * ZOOM}px) scale(${ZOOM})`
      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { titleRef, lensRef, glassRef, cloneRef }
}
