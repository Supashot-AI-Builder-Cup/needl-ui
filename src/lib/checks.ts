import type { Check, SectionKey } from '../types/domain'
import { countBySeverity, sortBySeverity, type SeverityCounts } from './severity'

export const SECTION_ORDER: SectionKey[] = ['store', 'listing', 'reviews']

export interface IndexedCheck extends Check {
  /** Position across all sections; used as the key for open/closed evidence. */
  index: number
}

export interface CheckGroup {
  section: SectionKey
  checks: IndexedCheck[]
  counts: SeverityCounts
}

/** Group checks by section, worst first, numbering them in display order. */
export function groupChecks(checks: Check[]): CheckGroup[] {
  let index = 0
  return SECTION_ORDER.map((section) => {
    const list = sortBySeverity(checks.filter((c) => c.section === section)).map((c) => ({ ...c, index: index++ }))
    return { section, checks: list, counts: countBySeverity(list) }
  })
}
