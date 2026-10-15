import type { Severity } from '../../../types/domain'
import './ProcessStep.css'

export type StepStatus = 'pending' | 'running' | 'done'

interface ProcessStepProps {
  index: number
  label: string
  result: string
  severity: Severity
  status: StepStatus
}

/** One line in the checking log: spinner while running, result once done. */
export function ProcessStep({ index, label, result, severity, status }: ProcessStepProps) {
  return (
    <li className={status} data-step={index}>
      <span className={`mark sev-${severity}`} />
      <div>
        <div>{label}</div>
        <div className={`res sev-${severity}`}>{status === 'done' ? result : ''}</div>
      </div>
    </li>
  )
}
