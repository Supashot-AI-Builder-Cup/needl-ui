import type { Lang } from '../../i18n'
import type {
  ApiLocale,
  CreateVerificationJobResponse,
  VerificationJob,
  VerificationJobAccepted,
  VerificationJobResponse,
  VerificationHistoryResponse,
  VerificationResponse,
  VerificationResult,
} from '../../types/api'
import { request } from './client'

const JOBS = '/api/v1/verification-jobs'
const VERIFICATIONS = '/api/v1/verifications'

export function toApiLocale(lang: Lang): ApiLocale {
  return lang === 'id' ? 'id-ID' : 'en-US'
}

/** Start a check from a Shopee link. */
export async function createLinkJob(url: string, locale: ApiLocale): Promise<VerificationJobAccepted> {
  const { body } = await request<CreateVerificationJobResponse>(JOBS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify({ url, locale }),
  })
  return body.data
}

/** Start a check from screenshots. The browser sets the multipart Content-Type itself. */
export async function createScreenshotJob(form: FormData): Promise<VerificationJobAccepted> {
  const { body } = await request<CreateVerificationJobResponse>(JOBS, {
    method: 'POST',
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    body: form,
  })
  return body.data
}

export async function getJob(jobId: string): Promise<{ job: VerificationJob; retryAfter: number | null }> {
  const { body, retryAfter } = await request<VerificationJobResponse>(`${JOBS}/${encodeURIComponent(jobId)}`)
  return { job: body.data, retryAfter }
}

export async function listVerifications(limit = 20, cursor?: string): Promise<VerificationHistoryResponse> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (cursor) params.set('cursor', cursor)
  const { body } = await request<VerificationHistoryResponse>(`${VERIFICATIONS}?${params}`)
  return body
}

export async function getVerification(verificationId: string): Promise<VerificationResult> {
  const { body } = await request<VerificationResponse>(`${VERIFICATIONS}/${encodeURIComponent(verificationId)}`)
  return body.data
}
