import { usePreferences } from '../../../context/preferences/usePreferences'
import type { SeverityCounts as Counts } from '../../../lib/severity'
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
  onCheckAnother: () => void
}

export function VerdictCard({ productView, counts, onCheckAnother }: VerdictCardProps) {
  const { t } = usePreferences()
  const { product, displayName } = productView
  const { displayScore, wordRef } = useVerdictReveal(product.score)
  const high = product.verdict === 'high'

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
      <Gauge score={product.score} verdict={product.verdict} label={`${t('score')} ${product.score} ${t('of')}`} />
      <div className="vword" ref={wordRef} style={{ color: high ? 'var(--crit)' : 'var(--pass)' }}>
        {high ? t('high') : t('safe')}
      </div>
      <div className="vscore">
        {t('score')} <span>{displayScore}</span> {t('of')}
      </div>
      <p className="vsum">{high ? t('vsumHigh') : t('vsumSafe')}</p>
      <div className="counts">
        <SeverityCounts counts={counts} />
      </div>
      <Button block onClick={onCheckAnother}>
        {t('another')}
      </Button>
    </div>
  )
}
