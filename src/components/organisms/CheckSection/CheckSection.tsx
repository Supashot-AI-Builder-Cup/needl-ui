import { useId } from 'react'
import { usePreferences } from '../../../context/preferences/usePreferences'
import type { CheckGroup } from '../../../lib/checks'
import { cx } from '../../../lib/cx'
import { FLAG_SEVERITIES } from '../../../lib/severity'
import { Icon, type IconName } from '../../atoms/Icon'
import { Pill } from '../../atoms/Pill'
import { CheckItem } from '../../molecules/CheckItem'
import { SectionCard } from '../../molecules/SectionCard'
import { SeverityCounts } from '../../molecules/SeverityCounts'
import { EvidenceView } from '../EvidenceView'
import './CheckSection.css'

interface CheckSectionProps {
  title: string
  icon: IconName
  group: CheckGroup
  open: boolean
  onToggle: () => void
  openChecks: Record<number, boolean>
  onToggleCheck: (index: number) => void
}

/** Collapsible card (Store, Listing, Reviews) holding its checks. */
export function CheckSection({ title, icon, group, open, onToggle, openChecks, onToggleCheck }: CheckSectionProps) {
  const { t, pick } = usePreferences()
  const bodyId = useId()
  const total = group.checks.length
  const flagged = FLAG_SEVERITIES.some((k) => group.counts[k])

  return (
    <SectionCard className={cx(open && 'is-open')}>
      <button type="button" className="shead" aria-expanded={open} aria-controls={bodyId} onClick={onToggle}>
        <span className="sic">
          <Icon name={icon} />
        </span>
        <span className="stitle">
          <span className="sname">{title}</span>
          <span className="smeta">
            <span className="ssub">
              {total} {total === 1 ? t('check') : t('checks')}
            </span>
            {flagged ? (
              <SeverityCounts counts={group.counts} severities={FLAG_SEVERITIES} />
            ) : (
              <Pill tone="pass">{t('pass')}</Pill>
            )}
          </span>
        </span>
        <Icon name="chevronDown" className="schev" strokeWidth={1.9} />
      </button>
      <div className="sbody" id={bodyId} hidden={!open}>
        {group.checks.map((check) => (
          <CheckItem
            key={check.index}
            name={pick(check.name)}
            severity={check.severity}
            summary={pick(check.summary)}
            open={!!openChecks[check.index]}
            onToggle={() => onToggleCheck(check.index)}
          >
            <EvidenceView evidence={check.evidence} />
          </CheckItem>
        ))}
      </div>
    </SectionCard>
  )
}
