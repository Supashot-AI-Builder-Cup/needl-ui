import type { ReactNode } from 'react'
import { cx } from '../../../lib/cx'
import './SectionCard.css'

interface SectionCardProps {
  /** Static cards have padding, a title and a lede; collapsible cards bring their own header. */
  isStatic?: boolean
  title?: string
  lede?: string
  className?: string
  children: ReactNode
}

export function SectionCard({ isStatic, title, lede, className, children }: SectionCardProps) {
  return (
    <section className={cx('sec card', isStatic && 'static', className)}>
      {title && <h3>{title}</h3>}
      {lede && <p className="sec-lede">{lede}</p>}
      {children}
    </section>
  )
}
