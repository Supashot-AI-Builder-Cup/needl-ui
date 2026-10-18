import { usePreferences } from '../../../context/preferences/usePreferences'
import { ZONE_LOOK, zoneForScore } from '../../../lib/gauge'
import type { Verdict } from '../../../types/domain'
import { Icon } from '../../atoms/Icon'
import { Pill } from '../../atoms/Pill'
import { ProductTile } from '../../atoms/ProductTile'
import { Tag } from '../../atoms/Tag'
import { MiniGauge } from '../MiniGauge'
import './index.css'

export interface HistoryCardData {
  name: string
  image?: string | null
  price: string
  score: number
  verdict: Verdict
}

interface HistoryCardProps extends HistoryCardData {
  onOpen: () => void
}

export function HistoryCard({ name, image, price, score, onOpen }: HistoryCardProps) {
  const { t } = usePreferences()
  const zone = zoneForScore(score)
  return (
    <li
      className="hcard"
      role="button"
      tabIndex={0}
      aria-label={`${t('seeDetails')}: ${name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <ProductTile className="hthumb" src={image} />
      <div className="hinfo">
        <div className="hname">{name}</div>
        <div className="hmeta">
          <span className="hprice">{price}</span>
          <Tag variant="soft">Shopee</Tag>
        </div>
        <div className="hscore">
          <MiniGauge score={score} zone={zone} />
          <Pill tone={ZONE_LOOK[zone].tone}>{t(ZONE_LOOK[zone].word)}</Pill>
          <span className="hnum">
            {score}
            <small>/100</small>
          </span>
        </div>
      </div>
      <Icon name="chevronRight" className="hchev" strokeWidth={1.8} />
    </li>
  )
}
