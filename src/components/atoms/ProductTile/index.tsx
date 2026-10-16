import type { BottleVariant } from '../../../types/domain'
import { cx } from '../../../lib/cx'
import { Bottle } from '../Bottle'
import './index.css'

interface ProductTileProps {
  className?: string
  variant?: BottleVariant
}

/** Grey tile holding the product illustration. */
export function ProductTile({ className, variant }: ProductTileProps) {
  return (
    <div className={cx('ptile', className)}>
      <Bottle {...variant} />
    </div>
  )
}
