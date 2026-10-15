import { arcPath, GAUGE_SEGMENTS, needleAngle } from '../../../lib/gauge'
import type { Verdict } from '../../../types/domain'
import { useGaugeAnimation } from './useGaugeAnimation'
import './index.css'

interface GaugeProps {
  score: number
  verdict: Verdict
  label: string
}

/** Large risk gauge with an animated needle. */
export function Gauge({ score, verdict, label }: GaugeProps) {
  const ref = useGaugeAnimation(score)
  return (
    <svg ref={ref} className="gauge" viewBox="0 0 200 116" role="img" aria-label={label}>
      {GAUGE_SEGMENTS.map((seg) => {
        const on = seg.zone === verdict
        return (
          <path
            key={seg.zone}
            className="gseg"
            data-on={on ? 1 : 0}
            d={arcPath(seg.from, seg.to)}
            fill="none"
            stroke={seg.color}
            strokeWidth="12"
            strokeLinecap="round"
            opacity={on ? 1 : 0.22}
          />
        )
      })}
      <g className="needle" data-angle={needleAngle(score)}>
        <path d="M98.4 104 L100 30 L101.6 104 Z" fill="var(--ink)" />
        <ellipse cx="100" cy="26" rx="2.2" ry="3.6" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
      </g>
      <circle cx="100" cy="104" r="6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  )
}
