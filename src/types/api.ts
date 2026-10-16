/** Types of the needl-service API (API_Contract.md, v1). */
import type { LocalText } from '../i18n'
import type { Check, Product, Store } from './domain'

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type RiskLevel = 'safe' | 'suspicious' | 'fraud'
export type ApiLocale = 'en-US' | 'id-ID'

export interface VerificationJobAccepted {
  id: string
  status: JobStatus
  status_url: string
  created_at: string
  poll_after_seconds: number
}

export interface CreateVerificationJobResponse {
  data: VerificationJobAccepted
  meta: { request_id: string }
}

export type ProductPreview = Omit<Product, 'score' | 'verdict'>

export interface JobPreview {
  displayName: string
  product: ProductPreview
}

export interface JobFailure {
  code: string
  message: string
}

export interface SourceMetadata {
  kind: 'url' | 'screenshots'
  url: string | null
  canonical_url: string | null
  marketplace: string | null
  fetched_at: string | null
  screenshot_count: number | null
}

export interface ListingMetadata {
  product_name: string | null
  store_name: string | null
  store_is_official: boolean | null
  price: string | null
  currency: string | null
  rating: number | null
  review_count: number | null
  sold_count: number | null
}

export interface VerificationResult {
  id: string
  source: SourceMetadata
  metadata: ListingMetadata
  trust_score: number
  risk_level: RiskLevel
  displayName: string
  product: Product
  checks: Check[]
  stores: Store[]
  questions: LocalText[]
  checked_at: string
  cached: boolean
}

export interface VerificationJob {
  id: string
  status: JobStatus
  created_at: string
  updated_at: string
  progress: number
  preview: JobPreview | null
  verification_id: string | null
  verification: VerificationResult | null
  error: JobFailure | null
}

export interface VerificationJobResponse {
  data: VerificationJob
  meta: { request_id: string }
}

export interface VerificationHistoryItem {
  id: string
  source_kind: 'url' | 'screenshots'
  source_url: string | null
  name: string
  price: string
  store_name: string | null
  trust_score: number
  risk_level: RiskLevel
  score: number
  verdict: 'high' | 'safe'
  finding_count: number
  checked_at: string
}

export interface VerificationHistoryResponse {
  data: VerificationHistoryItem[]
  meta: { request_id: string; next_cursor: string | null }
}

export interface VerificationResponse {
  data: VerificationResult
  meta: { request_id: string }
}
