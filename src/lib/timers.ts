/** A group of timeouts that can be cancelled together, e.g. on unmount. */
export interface TimerBag {
  after: (fn: () => void, ms: number) => void
  clear: () => void
}

export function createTimerBag(): TimerBag {
  const ids = new Set<number>()
  return {
    after(fn, ms) {
      const id = window.setTimeout(() => {
        ids.delete(id)
        fn()
      }, ms)
      ids.add(id)
    },
    clear() {
      ids.forEach((id) => window.clearTimeout(id))
      ids.clear()
    },
  }
}
