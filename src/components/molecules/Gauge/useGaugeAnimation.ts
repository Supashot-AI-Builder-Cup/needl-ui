import { useEffect, useRef } from 'react'
import { GAUGE_TIMING, needleAngle } from '../../../lib/gauge'
import { prefersReducedMotion } from '../../../lib/motion'

/** Draw the arc segments, then swing the needle past the score and settle on it. */
export function useGaugeAnimation(score: number) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    const needle = svg?.querySelector<SVGGElement>('.needle')
    if (!svg || !needle) return
    const angle = needleAngle(score)
    const final = `rotate(${angle}deg)`

    if (prefersReducedMotion() || !needle.animate) {
      needle.style.transform = final
      return
    }

    const { duration, delay } = GAUGE_TIMING
    const animations: Animation[] = []

    svg.querySelectorAll<SVGPathElement>('.gseg').forEach((seg, i) => {
      const length = seg.getTotalLength()
      seg.style.strokeDasharray = String(length)
      seg.setAttribute('opacity', '.22')
      animations.push(
        seg.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 520,
          delay: i * 140,
          easing: 'cubic-bezier(.4,0,.2,1)',
          fill: 'both',
        }),
      )
      if (seg.dataset.on === '1') {
        animations.push(
          seg.animate([{ opacity: 0.22 }, { opacity: 1 }], {
            duration: 380,
            delay: duration - 250,
            easing: 'ease-out',
            fill: 'forwards',
          }),
        )
      }
    })

    const swing = needle.animate(
      [
        { transform: 'rotate(-90deg)' },
        { transform: 'rotate(72deg)', offset: 0.42 },
        { transform: `rotate(${angle + (angle > 0 ? -10 : 10)}deg)`, offset: 0.78 },
        { transform: final },
      ],
      { duration, delay, easing: 'cubic-bezier(.33,.0,.25,1)', fill: 'both' },
    )
    swing.onfinish = () => {
      needle.style.transform = final
    }
    animations.push(swing)

    return () => animations.forEach((a) => a.cancel())
  }, [score])

  return ref
}
