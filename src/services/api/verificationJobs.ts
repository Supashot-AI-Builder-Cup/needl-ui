import type { Lang } from '../../i18n'
import type {
  ApiLocale,
  CreateVerificationJobResponse,
  VerificationJob,
  VerificationJobAccepted,
  VerificationJobResponse,
  VerificationResponse,
  VerificationResult,
} from '../../types/api'
import { API_BASE, request } from './client'

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
  return { job: withAbsoluteImages(body.data), retryAfter }
}

/** Photos cropped from screenshots come as API paths ("/api/v1/..."); make them full URLs. */
function absolute(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith('/') ? `${API_BASE}${url}` : url
}

function withAbsoluteImages(job: VerificationJob): VerificationJob {
  const preview = job.preview && {
    ...job.preview,
    product: { ...job.preview.product, image: absolute(job.preview.product.image) },
  }
  const verification = job.verification && {
    ...job.verification,
    product: { ...job.verification.product, image: absolute(job.verification.product.image) },
    checks: job.verification.checks.map((check) => ({
      ...check,
      evidence: check.evidence.map((ev) =>
        ev.kind === 'photoPair'
          ? { ...ev, listingImage: absolute(ev.listingImage), buyerImage: absolute(ev.buyerImage) }
          : ev,
      ),
    })),
  }
  return { ...job, preview, verification }
}

export async function getVerification(verificationId: string): Promise<VerificationResult> {
  const { body } = await request<VerificationResponse>(`/api/v1/verifications/${encodeURIComponent(verificationId)}`)
  return body.data
}
