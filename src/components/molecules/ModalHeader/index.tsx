import { Icon } from '../../atoms/Icon'
import './index.css'

interface ModalHeaderProps {
  titleId: string
  title: string
  subtitle?: string
  closeLabel: string
  onClose: () => void
}

export function ModalHeader({ titleId, title, subtitle, closeLabel, onClose }: ModalHeaderProps) {
  const heading = <h2 id={titleId}>{title}</h2>
  return (
    <div className="pv-head">
      {subtitle ? (
        <div>
          {heading}
          <p className="muted small" style={{ margin: 0 }}>
            {subtitle}
          </p>
        </div>
      ) : (
        heading
      )}
      <button type="button" className="pv-x" aria-label={closeLabel} onClick={onClose}>
        <Icon name="close" strokeWidth={1.9} />
      </button>
    </div>
  )
}
