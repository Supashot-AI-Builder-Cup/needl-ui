import { usePreferences } from '../../../context/preferences/usePreferences'
import type { Product } from '../../../types/domain'
import { ProductTile } from '../../atoms/ProductTile'
import { Stars } from '../../atoms/Stars'
import { Tag } from '../../atoms/Tag'
import './index.css'

interface ProductCardProps {
  product: Product
  displayName: string
}

/** Listing preview: photo, name, price, rating and store. */
export function ProductCard({ product, displayName }: ProductCardProps) {
  const { t, pick } = usePreferences()
  return (
    <div className="preview-card">
      <ProductTile />
      <div className="preview-meta">
        <p className="pname">
          {product.mall && (
            <>
              <Tag variant="mall">Mall</Tag>{' '}
            </>
          )}
          {displayName}
        </p>
        <div className="price">
          <b>{product.price}</b>
          {product.was && <s>{product.was}</s>}
        </div>
        <div className="pstats">
          <span>
            <Stars count={1} /> {product.rating} ({product.ratings} {t('ratings')})
          </span>
          <span>
            {pick(product.sold)} {t('sold')}
          </span>
        </div>
        <div className="storeline">
          <span className="avatar">D</span>
          <div>
            <div style={{ fontWeight: 500 }}>{product.store}</div>
            <div className="small muted">
              {t('from')} {product.loc}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
