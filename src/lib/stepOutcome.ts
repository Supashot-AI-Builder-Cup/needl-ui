import type { VerificationResult } from '../types/api'
import type { Severity, Step } from '../types/domain'

export type StepOutcome =
  | { kind: 'severity'; severity: Severity }
  | { kind: 'skipped' }
  | { kind: 'stores'; count: number; official: boolean }
  | { kind: 'questions'; count: number }

/** What a checking-log line shows once the result is known. Null when it has nothing to show. */
export function stepOutcome(step: Step, result: VerificationResult | null): StepOutcome | null {
  if (!result) return null
  switch (step.result.kind) {
    case 'check': {
      const code = step.result.code
      const check = result.checks.find((c) => c.code === code)
      // A check the server left out had no data to work with (e.g. no buyer photos).
      return check ? { kind: 'severity', severity: check.severity } : { kind: 'skipped' }
    }
    case 'stores':
      return { kind: 'stores', count: result.stores.length, official: result.product.mall }
    case 'questions':
      return { kind: 'questions', count: result.questions.length }
  }
}

/** Number of steps done at this job progress. */
export function stepsDone(steps: Step[], progress: number): number {
  return steps.filter((s) => progress >= s.progress).length
}
