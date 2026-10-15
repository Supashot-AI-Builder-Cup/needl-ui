import { usePreferences } from '../../../context/preferences/usePreferences'
import { SEVERITY_ORDER, type SeverityCounts as Counts } from '../../../lib/severity'
import type { Severity } from '../../../types/domain'
import { Pill } from '../../atoms/Pill'

interface SeverityCountsProps {
  counts: Counts
  /** Which severities to show, in order. Zero counts are skipped. */
  severities?: Severity[]
}

/** Pills like "3 Critical", "2 Major". */
export function SeverityCounts({ counts, severities = SEVERITY_ORDER }: SeverityCountsProps) {
  const { t } = usePreferences()
  return (
    <>
      {severities
        .filter((k) => counts[k])
        .map((k) => (
          <Pill key={k} tone={k}>
            {counts[k]} {t(k)}
          </Pill>
        ))}
    </>
  )
}
