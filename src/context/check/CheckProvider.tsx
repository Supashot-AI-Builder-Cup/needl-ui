import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { addHistoryEntry, historyEntryFrom, sanitizeHistory } from '../../lib/history'
import { readJSON, STORAGE_KEYS, writeStorage } from '../../lib/storage'
import type { VerificationHistoryItem, VerificationResult } from '../../types/api'
import type { HistoryEntry } from '../../types/domain'
import { listVerifications } from '../../services/api/verificationJobs'
import { CheckContext } from './CheckContext'

function initialHistory(): HistoryEntry[] {
  return sanitizeHistory(readJSON(STORAGE_KEYS.history))
}

export function CheckProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)
  const [results, setResults] = useState<Record<string, VerificationResult>>({})
  const [historyError, setHistoryError] = useState(false)
  const [historyCursor, setHistoryCursor] = useState<string | null>(null)
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false)

  const mapHistory = (items: VerificationHistoryItem[]): HistoryEntry[] =>
    items.map((item) => ({
      verificationId: item.id,
      name: item.name,
      price: item.price,
      score: item.score,
      verdict: item.verdict,
      checkedAt: item.checked_at,
    }))

  const getResult = useCallback((verificationId: string) => results[verificationId], [results])

  const refreshHistory = useCallback(async () => {
    try {
      const response = await listVerifications()
      const next = mapHistory(response.data)
      setHistory(next)
      setHistoryCursor(response.meta.next_cursor)
      writeStorage(STORAGE_KEYS.history, JSON.stringify(next))
      setHistoryError(false)
    } catch (error) {
      setHistoryError(true)
      throw error
    }
  }, [])

  const loadMoreHistory = useCallback(async () => {
    if (!historyCursor || loadingMoreHistory) return
    setLoadingMoreHistory(true)
    try {
      const response = await listVerifications(20, historyCursor)
      const next = [...history, ...mapHistory(response.data)]
      setHistory(next)
      setHistoryCursor(response.meta.next_cursor)
      writeStorage(STORAGE_KEYS.history, JSON.stringify(next))
      setHistoryError(false)
    } catch (error) {
      setHistoryError(true)
      throw error
    } finally {
      setLoadingMoreHistory(false)
    }
  }, [history, historyCursor, loadingMoreHistory])

  const saveResult = useCallback(
    (result: VerificationResult) => {
      setResults((prev) => ({ ...prev, [result.id]: result }))
      const next = addHistoryEntry(history, historyEntryFrom(result))
      setHistory(next)
      writeStorage(STORAGE_KEYS.history, JSON.stringify(next))
    },
    [history],
  )

  const value = useMemo(
    () => ({
      history,
      getResult,
      saveResult,
      refreshHistory,
      historyError,
      hasMoreHistory: Boolean(historyCursor),
      loadingMoreHistory,
      loadMoreHistory,
    }),
    [history, getResult, saveResult, refreshHistory, historyError, historyCursor, loadingMoreHistory, loadMoreHistory],
  )
  return <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
}
