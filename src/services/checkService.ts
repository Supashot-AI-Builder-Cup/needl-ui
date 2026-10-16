// Mock data source. Swap these functions for requests to needl-service
// (/scrape, /analyze) once the backend is wired up; callers stay the same.
import type { LocalText } from '../i18n'
import { CHECKS } from '../data/checks'
import { HISTORY_SEED } from '../data/historySeed'
import { PRODUCTS } from '../data/products'
import { BASE_QUESTIONS, FLAG_QUESTIONS } from '../data/questions'
import { STEPS } from '../data/steps'
import { STORES } from '../data/stores'
import type { Check, HistoryEntry, Product, Scenario, Step, Store } from '../types/domain'

interface SubjectRef {
  scenario: Scenario
  name: string | null
}

export interface ProductView {
  product: Product
  /** Name from the link when we have one, otherwise the listing name. */
  displayName: string
}

export interface CheckResult extends ProductView {
  checks: Check[]
  /** Empty when the listing is already the official store. */
  stores: Store[]
  questions: LocalText[]
}

export function getProductView({ scenario, name }: SubjectRef): ProductView {
  const product = PRODUCTS[scenario]
  return { product, displayName: name || product.name }
}

export function getCheckSteps(): Step[] {
  return STEPS
}

export function getCheckResult(subject: SubjectRef): CheckResult {
  const risky = subject.scenario === 'risky'
  return {
    ...getProductView(subject),
    checks: CHECKS[subject.scenario],
    stores: risky ? STORES : [],
    questions: risky ? [...FLAG_QUESTIONS, ...BASE_QUESTIONS] : BASE_QUESTIONS,
  }
}

export function getHistorySeed(): HistoryEntry[] {
  return HISTORY_SEED
}
