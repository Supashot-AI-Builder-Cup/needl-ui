import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../../../lib/cx'
import './ChipButton.css'

/** Rounded pill button with an icon, e.g. Back and Share. */
export function ChipButton({ className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cx('backbtn', className)} {...rest} />
}
