import { Icon } from '../../atoms/Icon'
import './ThemeToggle.css'

interface ThemeToggleProps {
  label: string
  onToggle: () => void
}

/** Shows a sun in dark mode and a moon in light mode (switched in CSS). */
export function ThemeToggle({ label, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" className="theme" aria-label={label} onClick={onToggle}>
      <Icon name="sun" className="sun" strokeWidth={1.8} />
      <Icon name="moon" className="moon" strokeWidth={1.8} />
    </button>
  )
}
