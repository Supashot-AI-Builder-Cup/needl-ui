import type { TextSegment } from '../../../../types/domain'
import './index.css'

/** Listing description with flagged phrases marked. */
export function HighlightedText({ segments }: { segments: TextSegment[] }) {
  return (
    <p className="desc">
      {segments.map((seg, i) => (seg.flagged ? <mark key={i}>{seg.text}</mark> : seg.text))}
    </p>
  )
}
