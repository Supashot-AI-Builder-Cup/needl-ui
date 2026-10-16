import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, request } from './client'

function respond(status: number, body: unknown, headers: Record<string, string> = {}) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(body === null ? null : JSON.stringify(body), { status, headers })),
  )
}

async function failure(): Promise<ApiError> {
  try {
    await request('/api/v1/verification-jobs/x')
  } catch (error) {
    if (error instanceof ApiError) return error
    throw error
  }
  throw new Error('request did not fail')
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('request errors', () => {
  it('reads code, message and request id from the error envelope', async () => {
    respond(404, { detail: { code: 'job_not_found', message: 'Verification job was not found.', request_id: 'req_A' } })
    const error = await failure()
    expect([error.status, error.code, error.requestId]).toEqual([404, 'job_not_found', 'req_A'])
  })

  it('falls back to the X-Request-ID header', async () => {
    respond(502, null, { 'X-Request-ID': 'req_B' })
    const error = await failure()
    expect([error.status, error.code, error.requestId]).toEqual([502, 'http_502', 'req_B'])
  })

  it('maps validation errors to validation_error', async () => {
    respond(422, { detail: [{ loc: ['body', 'url'], msg: 'Field required', type: 'missing' }] })
    expect((await failure()).code).toBe('validation_error')
  })

  it('keeps Retry-After', async () => {
    respond(429, { detail: { code: 'rate_limited', message: 'Too many requests.', request_id: 'req_C' } }, { 'Retry-After': '7' })
    expect((await failure()).retryAfter).toBe(7)
  })

  it('reports an unreachable server as status 0', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))))
    const error = await failure()
    expect([error.status, error.code]).toEqual([0, 'network_error'])
  })
})
