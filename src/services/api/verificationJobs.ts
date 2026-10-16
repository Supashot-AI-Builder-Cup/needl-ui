import type { Lang } from '../../i18n'
import type {
  ApiLocale,
  CreateVerificationJobResponse,
  VerificationJob,
  VerificationJobAccepted,
  VerificationJobResponse,
} from '../../types/api'
import { request } from './client'

const JOBS = '/api/v1/verification-jobs'

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
