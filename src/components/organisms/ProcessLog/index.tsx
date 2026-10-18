import { usePreferences } from '../../../context/preferences/usePreferences'
import { format } from '../../../i18n'
import { stepOutcome, type StepOutcome } from '../../../lib/stepOutcome'
import type { VerificationResult } from '../../../types/api'
import type { Step } from '../../../types/domain'
import { ProcessStep } from '../../molecules/ProcessStep'
import './index.css'

interface ProcessLogProps {
  steps: Step[]
  /** Number of steps done; the next one is running. */
  shown: number
  /** Known once the job is completed; fills in each step's result. */
  result: VerificationResult | null
}

export function ProcessLog({ steps, shown, result }: ProcessLogProps) {
  const { t, pick } = usePreferences()

  const text = (outcome: StepOutcome): string => {
    if (outcome.kind === 'severity') return t(outcome.severity)
    if (outcome.kind === 'skipped') return t('notEnoughData')
    if (outcome.kind === 'stores') {
      if (outcome.count) return format(t('storesFound'), { n: outcome.count })
      return outcome.official ? t('alreadyOfficial') : t('noSuggestions')
    }
    return format(t('questionsReady'), { n: outcome.count })
  }

  return (
    <ol className="log" aria-live="polite">
      {steps.map((step, i) => {
        const outcome = i < shown ? stepOutcome(step, result) : null
        return (
          <ProcessStep
            key={step.key}
            index={i}
            label={pick(step.label)}
            result={outcome ? text(outcome) : ''}
            severity={!outcome || outcome.kind === 'skipped' ? undefined : outcome.kind === 'severity' ? outcome.severity : 'pass'}
            status={i < shown ? 'done' : i === shown ? 'running' : 'pending'}
          />
        )
      })}
    </ol>
  )
}
