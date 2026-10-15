import { useId, type ReactNode } from 'react'
import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Severity } from '../../../types/domain'
import { Pill } from '../../atoms/Pill'
import './CheckItem.css'

interface CheckItemProps {
  name: string
  severity: Severity
  summary: string
  open: boolean
  onToggle: () => void
  /** Evidence shown when expanded. */
  children: ReactNode
}

export function CheckItem({ name, severity, summary, open, onToggle, children }: CheckItemProps) {
  const { t } = usePreferences()
  const bodyId = useId()
  return (
    <div className="check">
      <button type="button" className="chead" aria-expanded={open} aria-controls={bodyId} onClick={onToggle}>
        <span className="ct">{name}</span>
        <Pill tone={severity}>{t(severity)}</Pill>
        <span className="cs">{summary}</span>
        <span className="chev">{open ? t('hide') : t('show')}</span>
      </button>
      <div className="cbody" id={bodyId} hidden={!open}>
        {children}
      </div>
    </div>
  )
}
