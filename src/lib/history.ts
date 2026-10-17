import type { VerificationHistoryItem, VerificationResult } from '../types/api'
import type { HistoryEntry } from '../types/domain'

const MAX_ENTRIES = 30

function isEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const e = value as Record<string, unknown>
  return (
    typeof e.verificationId === 'string' &&
    typeof e.name === 'string' &&
    (e.image == null || typeof e.image === 'string') &&
    typeof e.price === 'string' &&
    typeof e.score === 'number' &&
    (e.verdict === 'high' || e.verdict === 'safe') &&
    typeof e.checkedAt === 'string'
  )
}

/** Keep only well-formed entries from untrusted storage data. */
export function sanitizeHistory(raw: unknown): HistoryEntry[] {
  return Array.isArray(raw) ? raw.filter(isEntry) : []
}

export function historyEntryFrom(result: VerificationResult): HistoryEntry {
  return {
    verificationId: result.id,
    name: result.displayName,
    image: result.product.image ?? null,
    price: result.product.price,
    score: result.product.score,
    verdict: result.product.verdict,
    checkedAt: result.checked_at,
  }
}

/** One item of `GET /api/v1/verifications` as a history entry. */
export function historyEntryFromItem(item: VerificationHistoryItem): HistoryEntry {
  return {
    verificationId: item.id,
    name: item.name,
    image: item.image ?? null,
    price: item.price,
    score: item.score,
    verdict: item.verdict,
    checkedAt: item.checked_at,
  }
}

/** Put `entry` first, drop an older entry for the same verification, cap the list length. */
export function addHistoryEntry(list: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  return [entry, ...list.filter((h) => h.verificationId !== entry.verificationId)].slice(0, MAX_ENTRIES)
}
