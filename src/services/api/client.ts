/** Thin fetch wrapper for needl-service. Errors become ApiError with the server's code. */

export const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  /** 0 when the server could not be reached. */
  readonly status: number
  readonly code: string
  readonly retryAfter: number | null

  constructor(status: number, code: string, message: string, retryAfter: number | null = null) {
    super(message)
    this.status = status
    this.code = code
    this.retryAfter = retryAfter
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
}

function readError(status: number, body: unknown, statusText: string): { code: string; message: string } {
  const detail = (body as { detail?: ErrorDetail | ErrorDetail[] } | null)?.detail
  if (Array.isArray(detail)) {
    return { code: 'validation_error', message: detail.map((d) => d.msg).join('; ') }
  }
  return { code: detail?.code ?? `http_${status}`, message: detail?.message ?? statusText }
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
    const { code, message } = readError(response.status, body, response.statusText)
    throw new ApiError(response.status, code, message, retryAfter)
  }
  return { body: body as T, status: response.status, retryAfter }
}
