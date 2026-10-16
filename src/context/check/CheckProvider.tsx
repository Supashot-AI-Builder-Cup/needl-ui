import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { addHistoryEntry, historyEntryFrom, sanitizeHistory } from '../../lib/history'
import { readJSON, STORAGE_KEYS, writeStorage } from '../../lib/storage'
import type { VerificationResult } from '../../types/api'
import type { HistoryEntry } from '../../types/domain'
import { CheckContext } from './CheckContext'

function initialHistory(): HistoryEntry[] {
  return sanitizeHistory(readJSON(STORAGE_KEYS.history))
}

export function CheckProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)
  const [results, setResults] = useState<Record<string, VerificationResult>>({})

  const getResult = useCallback((jobId: string) => results[jobId], [results])

  const saveResult = useCallback(
    (jobId: string, result: VerificationResult) => {
      setResults((prev) => ({ ...prev, [jobId]: result }))
      const next = addHistoryEntry(history, historyEntryFrom(jobId, result))
      setHistory(next)
      writeStorage(STORAGE_KEYS.history, JSON.stringify(next))
    },
    [history],
  )

  const value = useMemo(() => ({ history, getResult, saveResult }), [history, getResult, saveResult])
  return <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
}
