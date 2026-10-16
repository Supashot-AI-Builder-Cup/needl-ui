import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../../lib/motion'

const START_MS = 500
const TYPE_MS = 55
const ERASE_MS = 26
const HOLD_MS = 1700
const NEXT_MS = 380

/** Placeholder that types and erases `prefix + item` for each item in turn. */
export function useTypewriterPlaceholder(prefix: string, items: string[]): string {
  const source = prefix + '|' + items.join('|')
  const reduced = prefersReducedMotion()
  // Remember which prefix/items the text was typed for, so a language switch resets it.
  const [typed, setTyped] = useState({ source: '', text: '' })

  useEffect(() => {
    if (reduced) return
    let i = 0
    let n = 0
    let dir = 1
    let timer = 0
    const step = () => {
      const word = items[i]
      n += dir
      setTyped({ source, text: prefix + word.slice(0, n) })
      let delay = dir > 0 ? TYPE_MS : ERASE_MS
      if (dir > 0 && n === word.length) {
        dir = -1
        delay = HOLD_MS
      } else if (dir < 0 && n === 0) {
        dir = 1
        i = (i + 1) % items.length
        delay = NEXT_MS
      }
      timer = window.setTimeout(step, delay)
    }
    timer = window.setTimeout(step, START_MS)
    return () => window.clearTimeout(timer)
  }, [prefix, items, source, reduced])

  if (reduced) return prefix + items[0]
  return typed.source === source ? typed.text : prefix
}
