import { useState } from 'react'

const COLLAPSED_COUNT = 3

export function useHistoryList<T>(items: T[]) {
  const [expanded, setExpanded] = useState(false)
  return {
    expanded,
    toggle: () => setExpanded((e) => !e),
    visible: expanded ? items : items.slice(0, COLLAPSED_COUNT),
    hiddenCount: Math.max(0, items.length - COLLAPSED_COUNT),
  }
}
