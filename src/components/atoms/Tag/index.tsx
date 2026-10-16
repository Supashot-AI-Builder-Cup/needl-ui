import type { ReactNode } from 'react'
import './index.css'

const TAG_CLASS = {
  official: 'tagline',
  soft: 'tag-soft',
  mall: 'mallbadge',
}

interface TagProps {
  variant: keyof typeof TAG_CLASS
  children: ReactNode
}

export function Tag({ variant, children }: TagProps) {
  return <span className={TAG_CLASS[variant]}>{children}</span>
}
