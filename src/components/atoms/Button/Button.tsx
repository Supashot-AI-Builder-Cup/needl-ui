import type { ComponentProps } from 'react'
import { buttonClass, type ButtonLook } from './buttonClass'
import './Button.css'

type ButtonProps = ComponentProps<'button'> & ButtonLook

export function Button({ variant, size, block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, block }, className)} {...rest} />
}
