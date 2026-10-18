import { arcPath, GAUGE_SEGMENTS, needleAngle, type GaugeZone } from '../../../lib/gauge'
import './index.css'

interface MiniGaugeProps {
  score: number
  zone: GaugeZone
}

/** Small static gauge used in history cards. */
export function MiniGauge({ score, zone }: MiniGaugeProps) {
  return (
    <svg className="mgauge" viewBox="0 9 200 107" aria-hidden="true">
      {GAUGE_SEGMENTS.map((seg) => (
        <path
          key={seg.zone}
          d={arcPath(seg.from, seg.to)}
          fill="none"
          stroke={seg.color}
          strokeWidth="18"
          strokeLinecap="round"
          opacity={seg.zone === zone ? 1 : 0.22}
        />
      ))}
      <g transform={`rotate(${needleAngle(score)} 100 104)`}>
        <path d="M96 104 L100 34 L104 104 Z" fill="var(--ink)" />
      </g>
      <circle cx="100" cy="104" r="10" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
    </svg>
  )
}
