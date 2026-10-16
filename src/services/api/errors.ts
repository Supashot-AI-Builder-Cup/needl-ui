import type { TextKey } from '../../i18n'
import { ApiError } from './client'

/** `error.code` of a failed job (API_Contract.md, "Job error codes") -> UI text. */
const JOB_ERRORS: Record<string, TextKey> = {
  source_unavailable: 'errSourceUnavailable',
  listing_not_found: 'errListingNotFound',
  unsupported_url: 'errUnsupportedUrl',
  extraction_failed: 'errExtraction',
  analysis_failed: 'errAnalysis',
  timeout: 'errTimeout',
  interrupted: 'errInterrupted',
}

export function jobErrorText(code: string): TextKey {
  return JOB_ERRORS[code] ?? 'errServer'
}

/** A failed request (create or poll) -> UI text. */
export function requestErrorText(error: unknown, mode: 'link' | 'shots'): TextKey {
  if (!(error instanceof ApiError)) return 'errServer'
  if (error.status === 0) return 'errNetwork'
  if (error.status === 429) return 'errRateLimited'
  if (error.status === 413) return 'errFileSize'
  if (error.status === 415) return 'errFileType'
  if (error.status === 422 && mode === 'link') return 'errLink'
  return 'errServer'
}
