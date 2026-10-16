import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../services/api/client'
import { getJob } from '../services/api/verificationJobs'
import type { VerificationJob } from '../types/api'

const DEFAULT_POLL_S = 2
const RETRY_POLL_S = 5
const MAX_TRANSIENT_FAILURES = 5

function isTransient(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 0 || error.status === 429 || error.status >= 500)
}

/**
 * Poll a verification job until it is completed or failed, following the
 * server's Retry-After. Pass null to stay idle. `retry()` starts polling again
 * after `error` was set.
 */
export function useVerificationJob(jobId: string | null) {
  const [job, setJob] = useState<VerificationJob | null>(null)
  const [failure, setFailure] = useState<{ id: string; error: unknown } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!jobId) return
    let cancelled = false
    let timer = 0
    let failures = 0

    const poll = async () => {
      try {
        const { job: next, retryAfter } = await getJob(jobId)
        if (cancelled) return
        failures = 0
        setJob(next)
        if (next.status === 'completed' || next.status === 'failed') return
        timer = window.setTimeout(poll, (retryAfter ?? DEFAULT_POLL_S) * 1000)
      } catch (err) {
        if (cancelled) return
        failures += 1
        if (isTransient(err) && failures < MAX_TRANSIENT_FAILURES) {
          const wait = err instanceof ApiError && err.retryAfter ? err.retryAfter : RETRY_POLL_S
          timer = window.setTimeout(poll, wait * 1000)
        } else {
          setFailure({ id: jobId, error: err })
        }
      }
    }

    poll()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [jobId, attempt])

  const retry = useCallback(() => {
    setFailure(null)
    setAttempt((n) => n + 1)
  }, [])

  return { job: job?.id === jobId ? job : null, error: failure?.id === jobId ? failure.error : null, retry }
}
