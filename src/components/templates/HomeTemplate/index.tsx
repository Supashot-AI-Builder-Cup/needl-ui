import type { ReactNode } from 'react'
import './index.css'

interface HomeTemplateProps {
  hero: ReactNode
  children: ReactNode
}

/** Full-width hero, then a narrow centered column. */
export function HomeTemplate({ hero, children }: HomeTemplateProps) {
  return (
    <>
      {hero}
      <div className="narrow">{children}</div>
    </>
  )
}
