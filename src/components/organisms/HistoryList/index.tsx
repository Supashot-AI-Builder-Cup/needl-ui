import { usePreferences } from '../../../context/preferences/usePreferences'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { HistoryCard, type HistoryCardData } from '../../molecules/HistoryCard'
import { useHistoryList } from './useHistoryList'
import './index.css'

interface HistoryListProps {
  items: HistoryCardData[]
  onOpen: (index: number) => void
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
}

export function HistoryList({ items, onOpen, hasMore = false, loadingMore = false, onLoadMore }: HistoryListProps) {
  const { t } = usePreferences()
  const { expanded, toggle, visible, hiddenCount } = useHistoryList(items)
  if (!items.length) return null
  return (
    <section className="history">
      <h3>{t('history')}</h3>
      <ul>
        {visible.map((item, i) => (
          <HistoryCard key={i} {...item} onOpen={() => onOpen(i)} />
        ))}
      </ul>
      {(hiddenCount > 0 || hasMore) && (
        <Button
          className="hmore"
          aria-expanded={expanded}
          disabled={loadingMore}
          onClick={() => {
            if (!expanded) toggle()
            if (hasMore) onLoadMore?.()
            else if (expanded) toggle()
          }}
        >
          {expanded && !hasMore ? t('seeLess') : `${t('seeMore')}${hiddenCount ? ` (${hiddenCount})` : ''}`}
          <Icon name="chevronDown" strokeWidth={1.9} />
        </Button>
      )}
    </section>
  )
}
