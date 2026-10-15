import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Scenario, Step } from '../../../types/domain'
import { ProcessStep } from '../../molecules/ProcessStep'
import './ProcessLog.css'

interface ProcessLogProps {
  steps: Step[]
  scenario: Scenario
  /** Index of the running step; steps before it are done. */
  current: number
}

export function ProcessLog({ steps, scenario, current }: ProcessLogProps) {
  const { pick } = usePreferences()
  return (
    <ol className="log" aria-live="polite">
      {steps.map((step, i) => (
        <ProcessStep
          key={step.key}
          index={i}
          label={pick(step.label)}
          result={pick(step.result[scenario])}
          severity={step.severity[scenario]}
          status={i < current ? 'done' : i === current ? 'running' : 'pending'}
        />
      ))}
    </ol>
  )
}
