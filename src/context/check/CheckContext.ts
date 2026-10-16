import { createContext } from 'react'
import type { VerificationResult } from '../../types/api'
import type { HistoryEntry } from '../../types/domain'

export interface CheckValue {
  /** Finished checks, newest first, kept in localStorage. */
  history: HistoryEntry[]
  /** Result kept in memory after a check finishes, so /result/:jobId opens without a request. */
  getResult: (jobId: string) => VerificationResult | undefined
  /** Remember a finished check: cache its result and add it to history. */
  saveResult: (jobId: string, result: VerificationResult) => void
}

export const CheckContext = createContext<CheckValue | null>(null)
