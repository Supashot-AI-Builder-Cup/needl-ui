interface ShareInput {
  name: string
  verdict: string
  score: number
  /** Already translated, e.g. ["3 Critical", "3 Major"]. */
  counts: string[]
  link: string | null
}

/** Public link to a finished check; anyone can open it (the result is read from the API). */
export function resultUrl(origin: string, verificationId: string): string {
  return `${origin}/check/${encodeURIComponent(verificationId)}`
}

export function buildShareText({ name, verdict, score, counts, link }: ShareInput): string {
  const tally = counts.length ? ` (${counts.join(', ')})` : ''
  return [`needl: ${name}`, `${verdict}, ${score}/100${tally}`, link ?? ''].filter(Boolean).join('\n')
}
