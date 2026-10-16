/**
 * Thin fetch wrapper for needl-service. Errors become ApiError with the server's code.
 * The server's message and request ID are for developers only: the UI shows its own
 * text from services/api/errors.ts.
 */

export const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  /** 0 when the server could not be reached. */
  readonly status: number
  readonly code: string
  readonly retryAfter: number | null
  /** Server request ID, for matching a failure with the server log. Never shown to users. */
  readonly requestId: string | null

  constructor(
    status: number,
    code: string,
    message: string,
    retryAfter: number | null = null,
    requestId: string | null = null,
  ) {
    super(message)
    this.status = status
    this.code = code
    this.retryAfter = retryAfter
    this.requestId = requestId
  }
}

export interface ApiResponse<T> {
  body: T
  status: number
  /** Seconds from the Retry-After header, when present. */
  retryAfter: number | null
}

interface ErrorDetail {
  code?: string
  message?: string
  msg?: string
  request_id?: string
}

interface ReadError {
  code: string
  message: string
  requestId: string | null
}

function readError(status: number, body: unknown, statusText: string): ReadError {
  const detail = (body as { detail?: ErrorDetail | ErrorDetail[] } | null)?.detail
  if (Array.isArray(detail)) {
    return { code: 'validation_error', message: detail.map((d) => d.msg).join('; '), requestId: null }
  }
  return {
    code: detail?.code ?? `http_${status}`,
    message: detail?.message ?? statusText,
    requestId: detail?.request_id ?? null,
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'network_error', 'The needl server could not be reached.')
  }
  const retryAfter = Number(response.headers.get('Retry-After')) || null
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = readError(response.status, body, response.statusText)
    const requestId = error.requestId ?? response.headers.get('X-Request-ID')
    if (import.meta.env.DEV) {
      console.warn('[needl] request failed', { path, status: response.status, ...error, requestId })
    }
    throw new ApiError(response.status, error.code, error.message, retryAfter, requestId)
  }
  return { body: body as T, status: response.status, retryAfter }
}
