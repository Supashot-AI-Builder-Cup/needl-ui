import './index.css'

interface ReviewHistogramProps {
  values: number[]
  /** Indexes of suspicious days, drawn in the alert color. */
  hot: number[]
  range: [string, string]
  label: string
}

export function ReviewHistogram({ values, hot, range, label }: ReviewHistogramProps) {
  const max = Math.max(...values)
  return (
    <>
      <div className="hist" role="img" aria-label={label}>
        {values.map((v, i) => (
          <div
            key={i}
            className={hot.includes(i) ? 'hot' : undefined}
            style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="hist-x">
        <span>{range[0]}</span>
        <span>{range[1]}</span>
      </div>
    </>
  )
}
