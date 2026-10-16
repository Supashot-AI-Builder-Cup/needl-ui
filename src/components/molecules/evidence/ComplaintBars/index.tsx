import { usePreferences } from '../../../../context/preferences/usePreferences'
import type { ComplaintRow } from '../../../../types/domain'
import './index.css'

/** Horizontal bars counting low-star complaints per category. */
export function ComplaintBars({ rows }: { rows: ComplaintRow[] }) {
  const { pick } = usePreferences()
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <div className="bars">
      {rows.map((row, i) => (
        <div key={i} className="bar">
          <span>{pick(row.category)}</span>
          <div className="track">
            <div className="fill" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className="n">{row.count}</span>
        </div>
      ))}
    </div>
  )
}
