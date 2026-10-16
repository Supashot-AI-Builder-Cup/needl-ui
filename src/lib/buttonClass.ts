import { cx } from './cx'

export type ButtonVariant = 'primary' | 'quiet' | 'link'

export interface ButtonLook {
  variant?: ButtonVariant
  size?: 'sm'
  block?: boolean
}

/** Button classes, also used to style <a> and <label> as buttons. */
export function buttonClass({ variant = 'quiet', size, block }: ButtonLook, extra?: string): string {
  return cx(
    variant === 'link' ? 'btn-link' : `btn btn-${variant}`,
    size === 'sm' && 'btn-sm',
    block && 'btn-block',
    extra,
  )
}
