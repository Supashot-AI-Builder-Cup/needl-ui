import { usePreferences } from '../../../../context/preferences/usePreferences'
import type { Claim } from '../../../../types/domain'
import { Pill } from '../../../atoms/Pill'
import './index.css'

/** BPOM, Halal and marketing claims with their verification status. */
export function ClaimsList({ claims }: { claims: Claim[] }) {
  const { pick } = usePreferences()
  return (
    <ul className="claims">
      {claims.map((claim, i) => (
        <li key={i}>
          <span className="cn">{pick(claim.name)}</span>
          <span className="cd">{pick(claim.detail)}</span>
          <Pill tone={claim.status}>{pick(claim.label)}</Pill>
        </li>
      ))}
    </ul>
  )
}
