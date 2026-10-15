import type { ReactNode } from 'react'
import type { Severity } from '../../../types/domain'
import { cx } from '../../../lib/cx'
import './Pill.css'

interface PillProps {
  tone: Severity
  className?: string
  children: ReactNode
}

export function Pill({ tone, className, children }: PillProps) {
  return <span className={cx('pill', tone, className)}>{children}</span>
}
