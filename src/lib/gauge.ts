import type { TextKey } from '../i18n'
import type { Severity, Verdict } from '../types/domain'

// Gauge geometry in a 200-wide viewBox. Degrees run 0 (left) to 180 (right).
export const GAUGE_RADIUS = 84
const CX = 100
const CY = 104

export type GaugeZone = Verdict | 'careful'

export interface GaugeSegment {
  from: number
  to: number
  color: string
  zone: GaugeZone
}

export const GAUGE_SEGMENTS: GaugeSegment[] = [
  { from: 0, to: 58, color: 'var(--pass)', zone: 'safe' },
  { from: 61, to: 119, color: 'var(--major)', zone: 'careful' },
  { from: 122, to: 180, color: 'var(--crit)', zone: 'high' },
]

/** Zone of a 0-100 risk score; the same bounds as the server's risk levels. */
export function zoneForScore(score: number): GaugeZone {
  if (score >= 67) return 'high'
  if (score >= 33) return 'careful'
  return 'safe'
}

/** Words, pill tone and color for each zone. */
export const ZONE_LOOK: Record<GaugeZone, { word: TextKey; summary: TextKey; tone: Severity; color: string }> = {
  safe: { word: 'safe', summary: 'vsumSafe', tone: 'pass', color: 'var(--pass)' },
  careful: { word: 'careful', summary: 'vsumCareful', tone: 'major', color: 'var(--tm)' },
  high: { word: 'high', summary: 'vsumHigh', tone: 'critical', color: 'var(--crit)' },
}

/** Needle reveal timing, shared by the gauge and the verdict text. */
export const GAUGE_TIMING = { duration: 1700, delay: 300 }

export function polar(deg: number, r: number): [number, number] {
  const a = ((180 - deg) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}

export function arcPath(fromDeg: number, toDeg: number, r: number = GAUGE_RADIUS): string {
  const [x0, y0] = polar(fromDeg, r)
  const [x1, y1] = polar(toDeg, r)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

/** Score 0..100 -> needle rotation in degrees (-90 points left, 90 points right). */
export function needleAngle(score: number): number {
  return (score / 100) * 180 - 90
}
