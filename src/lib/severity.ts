import type { Severity } from '../types/domain'

export const SEVERITY_ORDER: Severity[] = ['critical', 'major', 'minor', 'pass']

/** Severities that count as a finding (everything except pass). */
export const FLAG_SEVERITIES: Severity[] = ['critical', 'major', 'minor']

export type SeverityCounts = Partial<Record<Severity, number>>

export function countBySeverity(items: Array<{ severity: Severity }>): SeverityCounts {
  const counts: SeverityCounts = {}
  for (const { severity } of items) counts[severity] = (counts[severity] ?? 0) + 1
  return counts
}

export function sortBySeverity<T extends { severity: Severity }>(items: T[]): T[] {
  return [...items].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
}
