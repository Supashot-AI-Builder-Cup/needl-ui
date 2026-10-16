import { createContext } from 'react'
import type { VerificationResult } from '../../types/api'
import type { HistoryEntry } from '../../types/domain'

export interface CheckValue {
  /** Finished checks, newest first, loaded from the API and cached locally. */
  history: HistoryEntry[]
  /** Result kept in memory after a check finishes, so /result/:verificationId opens without a request. */
  getResult: (verificationId: string) => VerificationResult | undefined
  /** Remember a finished check: cache its result and add it to history. */
  saveResult: (result: VerificationResult) => void
  /** Refresh saved verification summaries from the backend. */
  refreshHistory: () => Promise<void>
  historyError: boolean
  hasMoreHistory: boolean
  loadingMoreHistory: boolean
  loadMoreHistory: () => Promise<void>
}

export const CheckContext = createContext<CheckValue | null>(null)
