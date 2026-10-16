export interface DiffChar {
  char: string
  changed: boolean
}

/** Mark each character of `candidate` that differs from `reference` at the same position. */
export function diffChars(reference: string, candidate: string): DiffChar[] {
  return [...candidate].map((char, i) => ({ char, changed: char !== reference[i] }))
}
