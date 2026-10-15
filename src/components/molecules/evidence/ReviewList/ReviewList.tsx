import type { Review } from '../../../../types/domain'
import { Stars } from '../../../atoms/Stars'
import './ReviewList.css'

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {reviews.map((review, i) => (
        <div key={i} className="rev">
          <div className="who">
            <Stars count={review.stars} /> {review.who}
          </div>
          {review.text}
        </div>
      ))}
    </>
  )
}
