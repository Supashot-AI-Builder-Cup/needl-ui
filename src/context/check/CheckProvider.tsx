import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { addHistoryEntry, sanitizeHistory } from '../../lib/history'
import { readJSON, STORAGE_KEYS, writeStorage } from '../../lib/storage'
import { getHistorySeed } from '../../services/checkService'
import type { HistoryEntry, Subject } from '../../types/domain'
import { CheckContext } from './CheckContext'

function initialHistory(): HistoryEntry[] {
  const saved = sanitizeHistory(readJSON(STORAGE_KEYS.history))
  return saved.length ? saved : getHistorySeed()
}

export function CheckProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<Subject | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)

  const addToHistory = useCallback(
    ({ scenario, name, link }: Subject) => {
      const next = addHistoryEntry(history, { scenario, name, link })
      setHistory(next)
      writeStorage(STORAGE_KEYS.history, JSON.stringify(next))
    },
    [history],
  )

  const value = useMemo(
    () => ({ subject, setSubject, history, addToHistory }),
    [subject, history, addToHistory],
  )
  return <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
}
