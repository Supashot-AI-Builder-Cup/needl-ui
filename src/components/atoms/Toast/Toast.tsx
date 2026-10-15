import { cx } from '../../../lib/cx'
import './Toast.css'

interface ToastProps {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div className={cx('toast', visible && 'show')} role="status" aria-live="polite">
      {message}
    </div>
  )
}
