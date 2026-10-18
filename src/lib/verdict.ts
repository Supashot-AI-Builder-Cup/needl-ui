import type { TextKey } from '../i18n'
import { ZONE_LOOK, type GaugeZone } from './gauge'
import { FLAG_SEVERITIES, type SeverityCounts } from './severity'

/**
 * Summary under the verdict word. A careful score without any finding comes
 * from unchecked sections (the server adds risk for them), not from warning signs.
 */
export function verdictSummary(zone: GaugeZone, counts: SeverityCounts, incomplete: boolean): TextKey {
  if (zone === 'careful' && incomplete && !FLAG_SEVERITIES.some((k) => counts[k])) return 'vsumIncomplete'
  return ZONE_LOOK[zone].summary
}
