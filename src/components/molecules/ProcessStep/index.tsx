import type { Severity } from '../../../types/domain'
import './index.css'

export type StepStatus = 'pending' | 'running' | 'done'

interface ProcessStepProps {
  index: number
  label: string
  /** Shown once the step is done; empty while the result is unknown. */
  result: string
  /** Colors the mark and result; leave out while unknown. */
  severity?: Severity
  status: StepStatus
}

/** One line in the checking log: spinner while running, result once done. */
export function ProcessStep({ index, label, result, severity, status }: ProcessStepProps) {
  return (
    <li className={status} data-step={index}>
      <span className={severity ? `mark sev-${severity}` : 'mark'} />
      <div>
        <div>{label}</div>
        <div className={severity ? `res sev-${severity}` : 'res'}>{status === 'done' ? result : ''}</div>
      </div>
    </li>
  )
}
