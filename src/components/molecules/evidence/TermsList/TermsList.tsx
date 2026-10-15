import { usePreferences } from '../../../../context/preferences/usePreferences'
import type { Term } from '../../../../types/domain'
import './TermsList.css'

export function TermsList({ terms }: { terms: Term[] }) {
  const { pick } = usePreferences()
  return (
    <ul className="terms">
      {terms.map((term) => (
        <li key={term.term}>
          <b>{term.term}</b>: {pick(term.note)}
        </li>
      ))}
    </ul>
  )
}
