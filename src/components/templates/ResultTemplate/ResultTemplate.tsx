import type { ReactNode } from 'react'
import './ResultTemplate.css'

interface ResultTemplateProps {
  /** Top row, e.g. Back and Share. */
  actions: ReactNode
  /** Left column on desktop; sticks while the content scrolls. */
  aside: ReactNode
  children: ReactNode
}

export function ResultTemplate({ actions, aside, children }: ResultTemplateProps) {
  return (
    <>
      <div className="rtop">{actions}</div>
      <div className="result">
        <aside className="side">{aside}</aside>
        <div>{children}</div>
      </div>
    </>
  )
}
