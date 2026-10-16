import { useCallback, useEffect, useState } from 'react'
import { getVerification } from '../services/api/verificationJobs'
import type { VerificationResult } from '../types/api'

export function useVerification(verificationId: string | null) {
  const [loaded, setLoaded] = useState<{ id: string; result: VerificationResult } | null>(null)
  const [failed, setFailed] = useState<{ id: string; error: unknown } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!verificationId) return
    let cancelled = false
    getVerification(verificationId).then(
      (result) => {
        if (!cancelled) setLoaded({ id: verificationId, result })
      },
      (error: unknown) => {
        if (!cancelled) setFailed({ id: verificationId, error })
      },
    )
    return () => {
      cancelled = true
    }
  }, [verificationId, attempt])

  const retry = useCallback(() => {
    setFailed(null)
    setAttempt((n) => n + 1)
  }, [])

  return {
    result: loaded?.id === verificationId ? loaded.result : null,
    error: failed?.id === verificationId ? failed.error : null,
    retry,
  }
}
