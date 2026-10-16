import { useLayoutEffect, useRef, useState } from 'react'
import { CHECK_CATALOG } from '../../../data/checkCatalog'

export function useChecksOverview() {
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  // The hover "draw" animation needs each icon path's length in --len.
  useLayoutEffect(() => {
    if (!open) return
    listRef.current?.querySelectorAll<SVGGeometryElement>('.ci svg *').forEach((el) => {
      try {
        const length = el.getTotalLength()
        if (length) el.style.setProperty('--len', `${Math.ceil(length) + 1}px`)
      } catch {
        // Element has no measurable length.
      }
    })
  }, [open])

  return { open, toggle: () => setOpen((o) => !o), listRef, items: CHECK_CATALOG }
}
