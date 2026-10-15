import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Evidence } from '../../../types/domain'
import { ClaimsList } from '../../molecules/evidence/ClaimsList'
import { ComplaintBars } from '../../molecules/evidence/ComplaintBars'
import { FactsList } from '../../molecules/evidence/FactsList'
import { HighlightedText } from '../../molecules/evidence/HighlightedText'
import { NameCompare } from '../../molecules/evidence/NameCompare'
import { PhotoPair } from '../../molecules/evidence/PhotoPair'
import { ReviewHistogram } from '../../molecules/evidence/ReviewHistogram'
import { ReviewList } from '../../molecules/evidence/ReviewList'
import { TermsList } from '../../molecules/evidence/TermsList'
import './index.css'

/** Evidence cards for one check. */
export function EvidenceView({ evidence }: { evidence: Evidence[] }) {
  return (
    <>
      {evidence.map((item, i) => (
        <div key={i} className="ev">
          <EvidenceBody evidence={item} />
        </div>
      ))}
    </>
  )
}

function EvidenceBody({ evidence: ev }: { evidence: Evidence }) {
  const { t, pick } = usePreferences()
  switch (ev.kind) {
    case 'nameCompare':
      return (
        <>
          {ev.caption && <p className="ev-cap">{pick(ev.caption)}</p>}
          <NameCompare
            official={ev.official}
            store={ev.store}
            officialLabel={t('officialBrandStore')}
            storeLabel={t('thisStore')}
          />
          <FactsList facts={ev.facts} />
        </>
      )
    case 'description':
      return (
        <>
          <p className="ev-cap">{pick(ev.caption)}</p>
          <HighlightedText segments={ev.segments} />
          {ev.terms && <TermsList terms={ev.terms} />}
        </>
      )
    case 'claims':
      return <ClaimsList claims={ev.claims} />
    case 'histogram':
      return (
        <>
          <p className="ev-cap">{pick(ev.caption)}</p>
          <ReviewHistogram values={ev.values} hot={ev.hot} range={ev.range} label={t('reviewsPerDay')} />
        </>
      )
    case 'reviews':
      return (
        <>
          <p className="ev-cap">{pick(ev.caption)}</p>
          <ReviewList reviews={ev.reviews} />
        </>
      )
    case 'photoPair':
      return (
        <>
          <PhotoPair
            listingCaption={pick(ev.listingCaption)}
            buyerCaption={pick(ev.buyerCaption)}
            buyerVariant={ev.buyerVariant}
            diffs={ev.diffs?.map(pick)}
          />
          {ev.facts && <FactsList facts={ev.facts} />}
        </>
      )
    case 'complaints':
      return (
        <>
          <ComplaintBars rows={ev.rows} />
          {ev.quote && (
            <>
              <p className="quote">{ev.quote.text}</p>
              <p className="ev-cap" style={{ marginTop: 6 }}>
                {pick(ev.quote.caption)}
              </p>
            </>
          )}
          {ev.note && (
            <p className="ev-cap" style={{ marginTop: 12 }}>
              {pick(ev.note)}
            </p>
          )}
        </>
      )
  }
}
