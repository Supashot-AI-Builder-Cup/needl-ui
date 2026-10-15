import { usePreferences } from '../../../context/preferences/usePreferences'
import { cx } from '../../../lib/cx'
import type { Store } from '../../../types/domain'
import { buttonClass } from '../../atoms/Button'
import { Stars } from '../../atoms/Stars'
import { StoreLogo } from '../../atoms/StoreLogo'
import { Tag } from '../../atoms/Tag'
import './StoreRow.css'

export function StoreRow({ store }: { store: Store }) {
  const { t, pick } = usePreferences()
  const official = store.badge === 'official'
  return (
    <div className={cx('store', official && 'official')}>
      <StoreLogo name={store.logo} />
      <div className="sinfo">
        <div className="sn">
          {store.name}{' '}
          {official ? <Tag variant="official">{t('official')}</Tag> : <Tag variant="soft">{store.badge}</Tag>}
        </div>
        <div className="sd">
          <Stars count={1} /> {store.rating}
          {' '}
          {pick(store.sold)}
        </div>
        <div className="sp">{store.price}</div>
      </div>
      <a
        className={buttonClass({ variant: official ? 'primary' : 'quiet', size: 'sm' }, cx(official && 'shimmer', 'sbtn'))}
        href={store.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {t('seeListing')}
      </a>
    </div>
  )
}
