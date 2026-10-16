import type { BottleVariant } from '../../../../types/domain'
import { ProductTile } from '../../../atoms/ProductTile'
import './index.css'

interface PhotoPairProps {
  listingCaption: string
  buyerCaption: string
  buyerVariant?: BottleVariant
  /** Differences spotted between the two photos. */
  diffs?: string[]
}

export function PhotoPair({ listingCaption, buyerCaption, buyerVariant, diffs }: PhotoPairProps) {
  return (
    <>
      <div className="pair">
        <figure>
          <ProductTile />
          <figcaption>{listingCaption}</figcaption>
        </figure>
        <figure>
          <ProductTile variant={buyerVariant} />
          <figcaption>{buyerCaption}</figcaption>
        </figure>
      </div>
      {diffs && (
        <ul className="diffs">
          {diffs.map((diff) => (
            <li key={diff}>{diff}</li>
          ))}
        </ul>
      )}
    </>
  )
}
