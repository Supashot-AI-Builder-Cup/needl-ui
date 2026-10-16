import { usePreferences } from '../../../context/preferences/usePreferences'
import type { ProductPreview } from '../../../types/api'
import { ProductTile } from '../../atoms/ProductTile'
import { Stars } from '../../atoms/Stars'
import { Tag } from '../../atoms/Tag'
import './index.css'

interface ProductCardProps {
  /** Leave out while the product is loading to show a placeholder. */
  product?: ProductPreview
  displayName?: string
}

/** Listing preview: photo, name, price, rating and store. */
export function ProductCard({ product, displayName }: ProductCardProps) {
  const { t, pick } = usePreferences()
  if (!product) {
    return (
      <div className="preview-card" aria-busy="true">
        <div className="ptile sk" />
        <div className="preview-meta">
          <div className="sk sk-line" />
          <div className="sk sk-line short" />
          <div className="sk sk-price" />
        </div>
      </div>
    )
  }
  return (
    <div className="preview-card">
      <ProductTile src={product.image} alt={displayName ?? product.name} />
      <div className="preview-meta">
        <p className="pname">
          {product.mall && (
            <>
              <Tag variant="mall">Mall</Tag>{' '}
            </>
          )}
          {displayName ?? product.name}
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
          <span className="avatar">{product.store.trim().charAt(0).toUpperCase() || '?'}</span>
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
