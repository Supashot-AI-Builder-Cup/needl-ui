import { usePreferences } from '../../../context/preferences/usePreferences'
import { ZONE_LOOK, zoneForScore } from '../../../lib/gauge'
import type { SeverityCounts as Counts } from '../../../lib/severity'
import { verdictSummary } from '../../../lib/verdict'
import type { Product } from '../../../types/domain'
import { Button } from '../../atoms/Button'
import { ProductTile } from '../../atoms/ProductTile'
import { Gauge } from '../../molecules/Gauge'
import { SeverityCounts } from '../../molecules/SeverityCounts'
import { useVerdictReveal } from './useVerdictReveal'
import './index.css'

interface VerdictCardProps {
  productView: { product: Product; displayName: string }
  counts: Counts
  /** Which sections were not checked, when some were not. */
  uncheckedNote?: string | null
  onCheckAnother: () => void
}

export function VerdictCard({ productView, counts, uncheckedNote, onCheckAnother }: VerdictCardProps) {
  const { t } = usePreferences()
  const { product, displayName } = productView
  const { displayScore, wordRef } = useVerdictReveal(product.score)
  const zone = zoneForScore(product.score)
  const look = ZONE_LOOK[zone]

  return (
    <div className="verdict">
      <div className="vprod">
        <ProductTile src={product.image} alt={displayName} />
        <div>
          <div className="pn">{displayName}</div>
          <div className="pp">
            {product.price}
            {' '}
            {product.store}
          </div>
        </div>
      </div>
      <Gauge score={product.score} zone={zone} label={`${t('score')} ${product.score} ${t('of')}`} />
      <div className="vword" ref={wordRef} style={{ color: look.color }}>
        {t(look.word)}
      </div>
      <div className="vscore">
        {t('score')} <span>{displayScore}</span> {t('of')}
      </div>
      <p className="vsum">{t(verdictSummary(zone, counts, !!uncheckedNote))}</p>
      {uncheckedNote && <p className="vnote">{uncheckedNote}</p>}
      <div className="counts">
        <SeverityCounts counts={counts} />
      </div>
      <Button block onClick={onCheckAnother}>
        {t('another')}
      </Button>
    </div>
  )
}
