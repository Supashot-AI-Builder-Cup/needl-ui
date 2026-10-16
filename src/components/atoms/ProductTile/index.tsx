import type { BottleVariant } from '../../../types/domain'
import { cx } from '../../../lib/cx'
import { Bottle } from '../Bottle'
import { useImageFallback } from './useImageFallback'
import './index.css'

interface ProductTileProps {
  className?: string
  /** Product photo URL. Without one (or if it fails to load) the bottle illustration is shown. */
  src?: string | null
  alt?: string
  variant?: BottleVariant
}

/** Grey tile holding the product photo or illustration. */
export function ProductTile({ className, src, alt = '', variant }: ProductTileProps) {
  const { showImage, onError } = useImageFallback(src)
  return (
    <div className={cx('ptile', className)}>
      {showImage ? (
        // Shopee's CDN may refuse hotlinks that send a Referer, so send none.
        <img className="photo" src={src!} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={onError} />
      ) : (
        <Bottle {...variant} />
      )}
    </div>
  )
}
