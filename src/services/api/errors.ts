import type { TextKey } from '../../i18n'
import { ApiError } from './client'

/*
 * The only place that turns backend errors into UI text. Users see a short, localized
 * message about what happened and what to do next. The server's message, error code,
 * HTTP status and request ID are never shown; they go to the console in development.
 */

/** `error.code` of a failed job (API_Contract.md, "Job error codes") -> UI text. */
const JOB_ERRORS: Record<string, TextKey> = {
  source_unavailable: 'errSourceUnavailable',
  listing_not_found: 'errListingNotFound',
  unsupported_url: 'errUnsupportedUrl',
  extraction_failed: 'errExtraction',
  service_busy: 'errServiceBusy',
  analysis_failed: 'errAnalysis',
  timeout: 'errTimeout',
  interrupted: 'errInterrupted',
  internal_error: 'errServer',
}

export function jobErrorText(code: string): TextKey {
  return JOB_ERRORS[code] ?? 'errServer'
}

/** 413 codes from the screenshot upload (API_Contract.md, screenshot request). */
const TOO_LARGE: Record<string, TextKey> = {
  payload_too_large: 'errTotalSize',
  image_too_large: 'errImageTooLarge',
}

/** Gateway errors while Cloud Run starts or replaces an instance. */
const UNAVAILABLE_STATUSES = new Set([502, 503, 504])

/** A failed request (create or poll) -> UI text. */
export function requestErrorText(error: unknown, mode: 'link' | 'shots'): TextKey {
  if (!(error instanceof ApiError)) return 'errServer'
  const { status, code } = error
  if (status === 0) return 'errNetwork'
  if (status === 429) return 'errRateLimited'
  if (status === 413) return TOO_LARGE[code] ?? 'errFileSize'
  if (status === 415) return 'errFileType'
  if (status === 422) return mode === 'link' ? 'errLink' : 'errShotsInvalid'
  if (status === 404) return 'errJobNotFound'
  if (UNAVAILABLE_STATUSES.has(status)) return 'errUnavailable'
  return 'errServer'
}

/** The job or result does not exist (any more). */
export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}
