import './index.css'

interface BrandMarkProps {
  label: string
  onClick: () => void
}

/** "needl" wordmark; the final l is a needle. */
export function BrandMark({ label, onClick }: BrandMarkProps) {
  return (
    <button type="button" className="brand" aria-label={label} onClick={onClick}>
      need
      <svg viewBox="0 0 9 27" aria-hidden="true">
        <ellipse cx="4.5" cy="4" rx="2" ry="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 7.5 L6 7.5 L4.5 27 Z" fill="currentColor" />
      </svg>
    </button>
  )
}
