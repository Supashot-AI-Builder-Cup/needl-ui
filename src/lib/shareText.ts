interface ShareInput {
  name: string
  verdict: string
  score: number
  /** Already translated, e.g. ["3 Critical", "3 Major"]. */
  counts: string[]
  link: string | null
}

export function buildShareText({ name, verdict, score, counts, link }: ShareInput): string {
  const tally = counts.length ? ` (${counts.join(', ')})` : ''
  return [`needl: ${name}`, `${verdict}, ${score}/100${tally}`, link ?? ''].filter(Boolean).join('\n')
}
