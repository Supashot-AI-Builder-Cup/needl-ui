import { describe, expect, it } from 'vitest'
import { ApiError } from './client'
import { isNotFound, jobErrorText, requestErrorText } from './errors'

const apiError = (status: number, code = `http_${status}`) =>
  new ApiError(status, code, 'Traceback: KeyError at repository.py line 42', null, 'req_01TEST')

describe('requestErrorText', () => {
  it.each([
    [0, 'network_error', 'link', 'errNetwork'],
    [429, 'rate_limited', 'link', 'errRateLimited'],
    [413, 'payload_too_large', 'shots', 'errTotalSize'],
    [413, 'image_too_large', 'shots', 'errImageTooLarge'],
    [413, 'file_too_large', 'shots', 'errFileSize'],
    [413, 'too_many_images', 'shots', 'errFileSize'],
    [415, 'unsupported_image_type', 'shots', 'errFileType'],
    [422, 'validation_error', 'link', 'errLink'],
    [422, 'validation_error', 'shots', 'errShotsInvalid'],
    [404, 'job_not_found', 'link', 'errJobNotFound'],
    [502, 'http_502', 'link', 'errUnavailable'],
    [503, 'http_503', 'shots', 'errUnavailable'],
    [504, 'http_504', 'link', 'errUnavailable'],
    [400, 'mixed_input', 'link', 'errServer'],
    [409, 'idempotency_conflict', 'link', 'errServer'],
    [500, 'internal_error', 'link', 'errServer'],
  ] as const)('%i %s (%s) -> %s', (status, code, mode, expected) => {
    expect(requestErrorText(apiError(status, code), mode)).toBe(expected)
  })

  it('uses the generic text for anything that is not an ApiError', () => {
    expect(requestErrorText(new TypeError('Failed to fetch'), 'link')).toBe('errServer')
    expect(requestErrorText('boom', 'shots')).toBe('errServer')
  })

  it('never depends on the server message', () => {
    const odd = new ApiError(429, 'rate_limited', 'please show me to the user', null, null)
    expect(requestErrorText(odd, 'link')).toBe('errRateLimited')
  })
})

describe('jobErrorText', () => {
  it.each([
    ['source_unavailable', 'errSourceUnavailable'],
    ['listing_not_found', 'errListingNotFound'],
    ['unsupported_url', 'errUnsupportedUrl'],
    ['extraction_failed', 'errExtraction'],
    ['service_busy', 'errServiceBusy'],
    ['analysis_failed', 'errAnalysis'],
    ['timeout', 'errTimeout'],
    ['interrupted', 'errInterrupted'],
    ['internal_error', 'errServer'],
    ['something_new', 'errServer'],
    ['', 'errServer'],
  ])('%s -> %s', (code, expected) => {
    expect(jobErrorText(code)).toBe(expected)
  })
})

describe('isNotFound', () => {
  it('is true only for a 404 ApiError', () => {
    expect(isNotFound(apiError(404))).toBe(true)
    expect(isNotFound(apiError(500))).toBe(false)
    expect(isNotFound(null)).toBe(false)
  })
})
