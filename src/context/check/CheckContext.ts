import { createContext } from 'react'
import type { HistoryEntry, Subject } from '../../types/domain'

export interface CheckValue {
  /** Listing being checked or viewed; null until the user picks one. */
  subject: Subject | null
  setSubject: (subject: Subject) => void
  history: HistoryEntry[]
  addToHistory: (subject: Subject) => void
}

export const CheckContext = createContext<CheckValue | null>(null)
