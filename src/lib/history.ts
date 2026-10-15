import type { HistoryEntry, Scenario } from '../types/domain'

const MAX_ENTRIES = 30

function isScenario(value: unknown): value is Scenario {
  return value === 'risky' || value === 'safe'
}

/** Keep only well-formed entries from untrusted storage data. */
export function sanitizeHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((item): HistoryEntry[] => {
    if (!item || typeof item !== 'object') return []
    const { scenario, name, link } = item as Record<string, unknown>
    if (!isScenario(scenario)) return []
    return [{ scenario, name: typeof name === 'string' ? name : null, link: typeof link === 'string' ? link : null }]
  })
}

/** Put `entry` first, drop its older duplicate, cap the list length. */
export function addHistoryEntry(list: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const rest = list.filter((h) => !(h.link === entry.link && h.name === entry.name && h.scenario === entry.scenario))
  return [entry, ...rest].slice(0, MAX_ENTRIES)
}
