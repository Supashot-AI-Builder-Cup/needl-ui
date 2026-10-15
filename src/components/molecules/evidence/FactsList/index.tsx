import { usePreferences } from '../../../../context/preferences/usePreferences'
import type { Fact } from '../../../../types/domain'
import './index.css'

export function FactsList({ facts }: { facts: Fact[] }) {
  const { pick } = usePreferences()
  return (
    <ul className="facts">
      {facts.map((fact, i) => (
        <li key={i}>
          <span>{pick(fact.label)}</span>
          <span>{pick(fact.value)}</span>
        </li>
      ))}
    </ul>
  )
}
