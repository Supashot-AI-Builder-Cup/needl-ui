import type { ReactNode } from 'react'
import './index.css'

interface StatusMessageProps {
  title?: string
  text?: string
  /** Shows a spinner and announces the message politely. */
  busy?: boolean
  /** Buttons under the message. */
  children?: ReactNode
}

/** Loading, empty and error states. */
export function StatusMessage({ title, text, busy, children }: StatusMessageProps) {
  return (
    <div className="status-msg" role={busy ? 'status' : undefined}>
      {busy && <span className="status-spin" aria-hidden="true" />}
      {title && <h2>{title}</h2>}
      {text && <p className="muted">{text}</p>}
      {children && <div className="status-actions">{children}</div>}
    </div>
  )
}
